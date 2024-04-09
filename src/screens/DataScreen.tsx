import Sider from "antd/es/layout/Sider";
import MenuView from "../components/MenuView/MenuView";
import { FloatButton, Layout } from "antd";
import SingleLanguageView from "../components/SingleLangugeView/SingleLanguageView";
import { Footer, Header } from "antd/es/layout/layout";
import { Utils } from "../Utils/Utils";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../redux/store";
import { Language } from "../models/Language";
import HeaderView from "../components/HeaderView/HeaderView";
import KeyService from "../services/KeyService";
import { fetchKeys } from "../redux/key.slice";

function DataScreen() {
 
  const [languageCode, setLanagueCode] = useState("en");

  const keyModels = useSelector((state: RootState) => state.keyModels.value)
  const languages = useSelector((state: RootState) => state.user?.preferred_languages || [])


  const dispatch = useAppDispatch()

  useEffect(() => {
    console.log("RELOAD")
    dispatch(fetchKeys())
  }, [])


  return (
    <Layout>
      <Header style={{ height: "8vh", maxHeight: '10vh' }}>
        <HeaderView/>
      </Header>
      <Layout>
        <Sider style={{ height: "92vh",  backgroundColor: 'white'}}>
          <MenuView
            languages={languages}
            onSelectLanguageCode={(languageCode) => {
              setLanagueCode(languageCode);
            }}
          />
        </Sider>
        <Layout style={{ maxHeight: "92vh" }}>
          <SingleLanguageView 
          hidesDeleteButton={false}
            maxHeight={'80vh'} 
            languageCode={languageCode} 
            keyModels={keyModels} 
            onUpdateKeyModels={(updatedKeyModels, fullKeyModels) => {
                KeyService.shared.createOrUpdate(updatedKeyModels)
                .then( r => {
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
