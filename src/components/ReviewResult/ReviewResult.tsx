import { Layout, Modal, Typography } from "antd";
import { Footer, Header } from "antd/es/layout/layout";
import HeaderView from "../HeaderView/HeaderView";
import SingleLanguageView from "../SingleLangugeView/SingleLanguageView";
import MenuView from "../MenuView/MenuView";
import { useEffect, useState } from "react";
import { KeyModel } from "../../models/Key";
import { Language } from "../../models/Language";
import Sider from "antd/es/layout/Sider";
import KeyService from "../../services/KeyService";
import { useDispatch } from "react-redux";
import { fetchKeys } from "../../redux/key.slice";
import { useAppDispatch } from "../../redux/store";

function ReviewResult(props: {
  languages: Language[];
  keyModels: KeyModel[];
  onOK: () => void;
  onCancel: () => void;
}) {
  const [keyModels, setKeyModels] = useState(() => props.keyModels);
  const [languages, setLanguages] = useState(() => props.languages);
  const [languageCode, setLanguageCode] = useState("en");
  const dispatch = useAppDispatch()

  return (
    <Modal
      open={true}
      onOk={() => {
        KeyService.shared.createOrUpdate(keyModels)
        .then(r => {
          dispatch(fetchKeys())
        })
        props.onOK()
      }}
      onCancel={props.onCancel}
      okText="Import"
      title="Review"
      width={"90vw"}
    >
      <Layout>
        <Sider
          style={{
            height: "100%",
            backgroundColor: "white",
            maxHeight: "60vh",
          }}
        >
          <MenuView
            languages={languages}
            onSelectLanguageCode={(languageCode) => {
              setLanguageCode(languageCode);
            }}
          />
        </Sider>
        <Layout style={{ maxHeight: "60vh" }}>
          <SingleLanguageView
            hidesDeleteButton={true}
            maxHeight="60vh"
            languageCode={languageCode}
            keyModels={keyModels}
            onUpdateKeyModels={(updatedKeyModels, fullKeyModels) => {
              setKeyModels(fullKeyModels)
            }}
          />
        </Layout>
      </Layout>
      <Footer style={{ height: '10px', backgroundColor:'white'}}></Footer>

    </Modal>
  );
}

export default ReviewResult;
