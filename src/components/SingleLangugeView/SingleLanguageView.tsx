import React, { useEffect, useState } from "react";
import {
  Button,
  Dropdown,
  FloatButton,
  Input,
  MenuProps,
  Modal,
  Space,
  Table,
  Typography,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../redux/store";

import Search from "antd/es/input/Search";
import { throttle } from "lodash";
import TextArea from "antd/es/input/TextArea";
import AuthService from "../../services/AuthService";
import { Language } from "../../models/Language";
import { KeyModel } from "../../models/Key";
import KeyService from "../../services/KeyService";
import { fetchKeys } from "../../redux/key.slice";

function CopyStateButton(props: { onClickCopy: () => void }) {
  const [text, setText] = useState("Copy");
  return (
    <Button
      style={{ width: "80px" }}
      onClick={(e) => {
        setText("Copied");
        props.onClickCopy();
        setTimeout(() => {
          setText("Copy");
        }, 1000);
      }}
    >
      {text}
    </Button>
  );
}

function DeleteButton(props: { 
  getKey: () => string
 }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch()
  const handleOk = () => {
    setIsLoading(true)
    KeyService.shared.delete(props.getKey())
    .then(e => {
      setIsLoading(false)
      dispatch(fetchKeys())
      setIsModalOpen(false);
    })
    .catch(e => {
      setIsModalOpen(false);
    })  
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
    <Button
      style={{ width: "80px", backgroundColor: 'red', color: 'white' }}
      onClick={(e) => {
        setIsModalOpen(true)
      }}
    >
      Delete
    </Button>
  {
    isModalOpen ? (<Modal title="Delete" open={true} onOk={handleOk} onCancel={handleCancel } confirmLoading={isLoading}>
      <Typography>Do you want delete key: {props.getKey()}</Typography>
    </Modal>) : ""
  }
  </>);
}

function ModalButton(props: {
  getLanguageCode: () => string;
  getKey: () => string;
  getValue: () => string;
  onModalChanged: (languageCode: string, oldKey: string, key: string, value: string) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [languageCode, setLanguageCode] = useState("");
  const [value, setValue] = useState("");
  const [key, setKey] = useState((""));
  const [oldKey, setOldKey] = useState((""));

  const showModal = () => {
    setLanguageCode(props.getLanguageCode())
    setKey(props.getKey())
    setOldKey(props.getKey())
    setValue(props.getValue())
    setIsModalOpen(true);
  };

  const handleOk = () => {
    props.onModalChanged(languageCode, oldKey, key, value)
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <>
      <Button type="primary" onClick={showModal}>
        Edit
      </Button>
      {isModalOpen ? (
        <Modal title="Edit" open={true} onOk={handleOk} onCancel={handleCancel}>
          <Space.Compact block direction="vertical">
            <p>Key: </p>
            <TextArea
              placeholder="Key"
              defaultValue={key}
              onChange={(text) => {
                setKey(text.target.value);
              }}
            />
          </Space.Compact>

          <Space.Compact block direction="vertical">
            <p>Value: </p>
            <TextArea
              placeholder="Value"
              defaultValue={value}
              onChange={(text) => {
                setValue(text.target.value);
              }}
            />
          </Space.Compact>
          <br />
        </Modal>
        
      ) : (
        ""
      )}
    </>
  );
}

function SingleLanguageView(props: {
  languageCode: string
  keyModels: KeyModel[]
  maxHeight: string
  hidesDeleteButton: boolean
  onUpdateKeyModels: (updatedKeyModels: KeyModel[], fullKeyModels: KeyModel[]) => void 
}) {
  const [searchText, setSearchText] = useState("");

  const throttledSearch = throttle((value: string) => {
    setSearchText(value);
  }, 500);

  function onClickRecord(record: any) {
    let source = record["key"] || "";
    let destination = record["translated"] || "";

    navigator.clipboard.writeText(
      `"${source}"=${JSON.stringify(destination)};`
    );
  }

  function makeColumns() {
    let keyData = [
      {
        title: "STT",
        dataIndex: "#",
        key: "#",
        width: 60,
      },
      {
        title: "Key",
        dataIndex: "key",
        key: "key",
      },
      {
        title: "English",
        dataIndex: "en",
        key: "en",
      },
    ];
    let action = [
      {
        title: "Action",
        dataIndex: "##action##",
        key: "##action##",
        width: !props.hidesDeleteButton ? 280 : 200,
        render: (_: any, record: any) => {
          console.log("RENDER", record)
          return (
            <Space size="middle">
              <CopyStateButton
                onClickCopy={() => {
                  var source = record["key"] || "";
                  var destination = record["translated"] || "";

                  navigator.clipboard.writeText(
                    `"${source}"=${JSON.stringify(destination)};`
                  );
                }}
              />
              <ModalButton
                getLanguageCode={() => props.languageCode}
                getKey={() => record["key"] || ""}
                getValue={() => record["translated"] || ""}
                onModalChanged={(languageCode, oldKey, newKey, value) => {
                  var model = props.keyModels.find(e => e.key === oldKey)
                  
                  var isChangedKey = oldKey != newKey
                  var isChangedValue = model?.translates.find(e => e.language.language_code == languageCode)?.value != value

                  if (!isChangedKey && !isChangedValue) { return; }

                  var copy = JSON.parse(JSON.stringify(props.keyModels)) as KeyModel[]
                  var idx = copy.findIndex(e => e.key === oldKey)
                  var idxTranslate = copy[idx].translates.findIndex(e => e.language.language_code == languageCode)
                  copy[idx].key = newKey
                  copy[idx].translates[idxTranslate].value = value
                  props.onUpdateKeyModels([copy[idx]], copy)
                }}
              />
              { !props.hidesDeleteButton ? <DeleteButton getKey={() => record["key"] || ""}/> : ""}
            </Space>
          );
        },
      },
    ];

    let localization = AuthService.shared.currentUser?.prefered_languages.find(
      (localization) => localization.language_code === props.languageCode
    );

    if (localization) {
      let data = {
        title: localization.language_name,
        dataIndex: "translated",
        key: "translated",
      };
      return [...keyData, ...[data], ...action];
    }

    return [...keyData, ...action];
  }

  function makeDataSource() {
    const filterSearch = (key: string) => {
      if (searchText.trim().length === 0) {
        return true;
      }
      return key.toLowerCase().includes(searchText.toLowerCase());
    };

    const remaked = props.keyModels.map((e) => {
      var newObject: any = Object.assign({}, e);
      newObject.en = e.translates.find(
        (t) => t.language?.language_code == "en"
      );
      newObject.translated = e.translates.find(
        (t) => t.language?.language_code == props.languageCode
      );
      return newObject;
    });

    const translateSearched = remaked.filter((e) => {
      return (
        filterSearch(e.key) ||
        filterSearch(e.en?.value || "") ||
        filterSearch(e.translated?.value || "")
      );
    });

    return translateSearched.map((translate, idx) => {
      return {
        "#": idx + 1,
        key: translate.key,
        en: translate.en?.value || "",
        translated: translate.translated?.value || "",
      };
    });
  }

  return (
    <>
      <Search
        placeholder={"Search Key Here "}
        style={{ marginLeft: "20px", marginTop: "20px", width: "50%" }}
        onChange={(e) => {
          throttledSearch(e.target.value || "");
        }}
      />
      <Table
        columns={makeColumns()}
        dataSource={makeDataSource()}
        pagination={{ position: ["bottomCenter"], pageSize: 100}}
        scroll={{ y: `calc(${props.maxHeight} - 80px)` }}
        style={{ margin: "20px", maxHeight: `calc(${props.maxHeight} - 80px)` }}
      ></Table>
    </>
  );
}

export default SingleLanguageView;
