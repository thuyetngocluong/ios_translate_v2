import Sider from "antd/es/layout/Sider";
import MenuView from "../components/MenuView/MenuView";
import {Layout} from "antd";
import SingleLanguageView from "../components/SingleLangugeView/SingleLanguageView";
import {Header} from "antd/es/layout/layout";
import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../redux/store";
import HeaderView from "../components/HeaderView/HeaderView";
import KeyService from "../services/KeyService";
import {fetchKeys} from "../redux/key.slice";
import LanguageService from "../services/LanguageService";
import {setSelectApplication} from "../redux/application.slice";
import AuthService from "../services/AuthService";
import Const from "../Utils/Const";

function DataScreen() {

    const [languageCode, setLanagueCode] = useState("en");

    const keyModels = useSelector((state: RootState) => state.keyModels.value)
    const selectedApplication = useSelector((state: RootState) => state.selectedApplication)

    const dispatch = useAppDispatch()

    useEffect(() => {
        console.log("RELOAD")
        dispatch(fetchKeys())
        LanguageService.shared.fetchLanguages().catch()
        if (AuthService.shared.currentUser) {
            let application = AuthService.shared.currentUser?.applications.find(e => e.id.toString() === Const.currentApplicationID()) || AuthService.shared.currentUser?.applications[0] || null
            dispatch(setSelectApplication(application))
        }
    }, [dispatch])

    useEffect(() => {
        dispatch(fetchKeys())
        LanguageService.shared.fetchLanguages().catch()
    }, [dispatch, selectedApplication]);


    return (
        <Layout>
            <Header style={{height: "8vh", maxHeight: '10vh'}}>
                <HeaderView/>
            </Header>
            <Layout>
                <Sider style={{height: "92vh", backgroundColor: 'white'}}>
                    <MenuView
                        maxHeight={'100%'}
                        languages={selectedApplication.value?.languages || []}
                        onSelectLanguageCode={(languageCode) => {
                            setLanagueCode(languageCode);
                        }}
                    />
                </Sider>
                <Layout style={{maxHeight: "92vh"}}>
                    <SingleLanguageView
                        hidesDeleteButton={false}
                        maxHeight={'80vh'}
                        languageCode={languageCode}
                        keyModels={keyModels}
                        onUpdateKeyModels={(updatedKeyModels, fullKeyModels) => {
                            KeyService.shared.createOrUpdate(updatedKeyModels, (str) => {})
                                .then(r => {
                                    dispatch(fetchKeys())
                                })
                        }}
                    />
                </Layout>
            </Layout>
        </Layout>
    );
}

export default DataScreen;
