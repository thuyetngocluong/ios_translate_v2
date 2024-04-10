import {useDispatch, useSelector} from "react-redux";
import LanguageService from "../../services/LanguageService";
import {Key, useEffect, useState} from "react";
import {Button, Flex, Modal, Space, Typography} from "antd";
import TextArea from "antd/es/input/TextArea";
import AuthService from "../../services/AuthService";
import {RootState} from "../../redux/store";
import {KeyModel} from "../../models/Key";
import {Language} from "../../models/Language";
import ReviewResult from "../ReviewResult/ReviewResult";
import Const from "../../Utils/Const";

function ModalImportNewWord(props: {
    onTranslateSuccess: (languages: Language[], keyModels: KeyModel[]) => void,
    onCancel: () => void
}) {
    const [isLoading, setIsLoading] = useState(false);
    const [okText, setOKText] = useState("OK")
    const [sentences, setSentences] = useState("");
    const [contextText, setContextText] = useState("");
    const selectedApplication = useSelector((state: RootState) => state.selectedApplication);
    const preferred_languages = useSelector(
        (state: RootState) => state.selectedApplication.value?.languages || []
    );

    const onInputChange = (e: any) => {
        setSentences(e.target.value || "");
    };

    const onContextChange = (e: any) =>
        setContextText(e.target.value || "")

    const handleOk = () => {
        const sources = sentences.split("\n");
        const context = (() => {
            if (contextText.trim().length == 0) {
                return selectedApplication.value?.default_context || ""
            }
            return contextText.trim()
        })()
        setIsLoading(true)
        LanguageService.shared
            .translate(
                sources,
                context,
                preferred_languages.map((l) => l.language_code),
                (okText) => {
                    setOKText(okText)
                }
            )
            .then((response) => {
                const languageCodes = Object.keys(response)
                const languages = preferred_languages.filter(l => languageCodes.includes(l.language_code))
                const application = AuthService.shared.currentUser?.applications.find(e => e.id.toString() === Const.currentApplicationID())
                if (application) {
                    const keyModels: KeyModel[] = sources.map((k, index) => {
                        return {
                            id: "",
                            key: k,
                            unique: "",
                            application: application,
                            translates: languages.map(l => {
                                return {
                                    language: l,
                                    value: response[l.language_code][index] || ""
                                }
                            })
                        }
                    })
                    props.onTranslateSuccess(languages, keyModels);
                } else {
                    props.onTranslateSuccess(languages, []);
                }
                setOKText("OK")
                setIsLoading(false)
            })
            .catch((error) => {
                setIsLoading(false)
            });
    };

    const handleCancel = () => {
        props.onCancel()
    };

    return (
        <Modal
            title="Import"
            open={true}
            onOk={handleOk}
            okText={okText}
            onCancel={handleCancel}
            confirmLoading={isLoading}
            width={"70vw"}
        >
            <div>
                <Typography style={{fontWeight: "500"}}>
                    Enter your context
                </Typography>
                <TextArea
                    id="InputSetence_ImportNewWord"
                    placeholder="Enter Your Context to translate your words"
                    defaultValue={selectedApplication.value?.default_context || ""}
                    disabled={isLoading}
                    style={{height: "10vh"}}
                    onChange={onContextChange}
                ></TextArea>
                <br/>
                <br/>
                <Typography style={{fontWeight: "500"}}>
                    Enter your sentences
                </Typography>
                <TextArea
                    id="InputSetence_ImportNewWord"
                    placeholder="Enter your sentences, separator by newline"
                    disabled={isLoading}
                    style={{height: "20vh"}}
                    onChange={onInputChange}
                ></TextArea>
            </div>
        </Modal>
    );
}

function ImportNewWord() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isOpenReview, setIsOpenReview] = useState(false);
    const [review, setReview] = useState({
        languages: [] as Language[],
        keyModels: [] as KeyModel[]
    });

    const showModal = () => {
        setIsModalOpen(true);
    };

    return (
        <>
            <Button type="primary" onClick={showModal}>
                Import
            </Button>
            {isOpenReview ? <ReviewResult
                    languages={review.languages} keyModels={review.keyModels}
                    onOK={() => {
                        setIsOpenReview(false)
                    }}
                    onCancel={() => setIsOpenReview(false)}
                />
                : isModalOpen ? (
                    <ModalImportNewWord
                        onTranslateSuccess={(languages, keyModels) => {
                            setIsModalOpen(false)
                            setIsOpenReview(true)
                            setReview({languages: languages, keyModels: keyModels})
                        }}
                        onCancel={() => {
                            setIsModalOpen(false)
                        }
                        }
                    />
                ) : (
                    ""
                )}
        </>
    );
}

export default ImportNewWord;
