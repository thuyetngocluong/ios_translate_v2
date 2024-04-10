import {Button, Flex, Modal} from "antd";
import ImportNewWord from "./ImportNewWord";
import SelectPreferLanguageView from "./SelectPreferLanguageView";
import {useState} from "react";
import {FileUploader} from "react-drag-drop-files";
import {KeyModel, TranslateItem} from "../../models/Key";
import LanguageService from "../../services/LanguageService";
import {Application} from "../../models/Application";
import {useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import ReviewResult from "../ReviewResult/ReviewResult";
import JSZip from "jszip";
import {Language} from "../../models/Language";
import {retry} from "@reduxjs/toolkit/query";

const processStringsFile = (string: string) => {
    const regexPattern = /"([^"]+)"\s*=\s*"([^"]+)"\s*;(\n|\n?$)/g;

    const keyValuePairs = {} as any;

    let match;
    while ((match = regexPattern.exec(string)) !== null) {
        const key = match[1];
        const value = match[2];
        keyValuePairs[key] = value;
    }

    return keyValuePairs
}

const processStringCatalog = (jsonRaw: string, application: Application) => {
    const data = JSON.parse(jsonRaw);

    if (!data["strings"]) return [];

    const keys = Object.keys(data["strings"]);
    const languages = LanguageService.shared.languages

    return keys.map(key => {
        let importTranslates = data["strings"][key]["localizations"] || {};
        let translates: (TranslateItem | null)[] = languages.map(language => {
            try {
                const value = importTranslates[language.language_code]["stringUnit"]["value"] as string
                if (!value) return null
                return {
                    language: language,
                    value: value
                }
            } catch {
                return null
            }
        })

        const aKeyModel: KeyModel = {
            id: "-1",
            key: key,
            unique: null,
            application: application,
            translates: translates.filter(e => e != null) as any
        }

        return aKeyModel
    })
}

const processZipFile = (file: any, application: Application, onLoaded: (data: KeyModel[]) => void) => {
    const reader = new FileReader();

    reader.onload = async () => {
        try {
            const zip = await JSZip.loadAsync(reader.result as any);
            const folderSet = new Set();

            let entries: JSZip.JSZipObject[] = []
            zip.forEach((relativePath, zipEntry) => {
                if (zipEntry.name.endsWith("Localizable.strings")) {
                    entries.push(zipEntry)
                }
            });
            let result: KeyModel[] = []

            for (let i = 0; i < entries.length; i++) {
                let entry = entries[i];
                let languageCode = entry.name.split("/").find(e => e.endsWith(".lproj"))?.replace(".lproj", "");
                let language = LanguageService.shared.languages.find(l => {
                    if (!languageCode) { return false }
                    return  l.language_code == languageCode || languageCode.split('-').includes(l.language_code)
                })
                if (!language) continue;

                let data = await entry.async('text')
                let processedData = processStringsFile(data)
                let keys = Object.keys(processedData);
                keys.forEach(key => {
                    let idx = result.findIndex(km => km.key == key)
                    if (idx >= 0) {
                        let idxTranslate = result[idx].translates.findIndex(e => e.language.language_code == language?.language_code)
                        if (idxTranslate >= 0) {
                            result[idx].translates[idxTranslate].value = processedData[key]
                        } else {
                            result[idx].translates.push({
                                language: language as any,
                                value: processedData[key] || ""
                            })
                        }
                    } else {
                        result.push({
                            id: "-1",
                            key: key,
                            unique: null,
                            application: application,
                            translates: [{
                                language: language as any,
                                value: processedData[key] || ""
                            }]
                        })
                    }
                })
            }

            onLoaded(result)

        } catch (error) {
            onLoaded([])
            console.error('Error reading zip file:', error);
        }
    };

    reader.readAsArrayBuffer(file);
}

function ImportFromStringCatalog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenReviewView, setIsOpenReviewView] = useState(false);
    const [review, setReview] = useState([] as KeyModel[])
    const selectedApplication = useSelector((state: RootState) => state.selectedApplication)

    const handleChange = (file: any) => {
        console.log(file)
        const fileReader = new FileReader()
        fileReader.onload = (event) => {
            try {
                let application = selectedApplication.value
                if (application) {
                    const newReview = processStringCatalog(event.target?.result as string, application)
                    setIsOpen(false)
                    setReview(newReview)
                    setIsOpenReviewView(true)
                }

            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };

        fileReader.readAsText(file);
    };
    return (
        <>
            <Button type='primary' onClick={() => {
                setIsOpen(true)
            }}>Import From String Catalog</Button>
            {
                isOpenReviewView
                    ? (<ReviewResult languages={review[0].translates.map(e => e.language) || []}
                                     keyModels={review}
                                     onOK={() => {
                                         setIsOpen(false)
                                         setIsOpenReviewView(false)
                                     }}
                                     onCancel={() => {
                                         setIsOpen(false)
                                         setIsOpenReviewView(false)
                                     }}/>
                    )
                    : (
                        isOpen ? <Modal open={true}
                                        okButtonProps={{style: {visibility: 'hidden'}}}
                                        cancelButtonProps={{style: {visibility: 'hidden'}}}
                                        onCancel={() => setIsOpen(false)}
                            >
                                <br/>
                                <br/>
                                <FileUploader handleChange={handleChange} types={["xcstrings"]}/>
                            </Modal>
                            :
                            ""
                    )
            }
        </>
    )
}

function ImportFromZip() {
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenReviewView, setIsOpenReviewView] = useState(false);
    const [review, setReview] = useState([] as KeyModel[])
    const selectedApplication = useSelector((state: RootState) => state.selectedApplication)

    const handleChange = (file: any) => {
        console.log(file)
        let application = selectedApplication.value
        if (application) {
            processZipFile(file, application, (result) => {
                setIsOpen(false)
                setIsOpenReviewView(true)
                setReview(result)
            })
        }
    };
    return (
        <>
            <Button type='primary' onClick={() => {
                setIsOpen(true)
            }}>Import From Zip</Button>
            {
                isOpenReviewView
                    ? (<ReviewResult languages={review[0].translates.map(e => e.language) || []}
                                     keyModels={review}
                                     onOK={() => {
                                         setIsOpen(false)
                                         setIsOpenReviewView(false)
                                     }}
                                     onCancel={() => {
                                         setIsOpen(false)
                                         setIsOpenReviewView(false)
                                     }}/>
                    )
                    : (
                        isOpen ? <Modal open={true}
                                        okButtonProps={{style: {visibility: 'hidden'}}}
                                        cancelButtonProps={{style: {visibility: 'hidden'}}}
                                        onCancel={() => setIsOpen(false)}
                            >
                                <br/>
                                <br/>
                                <FileUploader handleChange={handleChange} types={["zip"]}/>
                            </Modal>
                            :
                            ""
                    )
            }
        </>
    )
}

function ImportView() {
    return <Flex gap="small" align="center">
        <ImportFromStringCatalog/>
        <ImportFromZip/>
    </Flex>
}

export default ImportView;