import {Button, Dropdown, Flex, MenuProps, Modal, Typography} from "antd";
import LanguageService from "../../services/LanguageService";
import {useEffect, useState} from "react";
import {Language} from "../../models/Language";
import AuthService from "../../services/AuthService";
import SelectPreferLanguageView from "./SelectPreferLanguageView";
import ImportNewWord from "./ImportNewWord";
import {Utils} from "../../Utils/Utils";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "../../redux/store";
import {setSelectApplication} from "../../redux/application.slice";
import {LogoutOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";

function ExportToStringZip() {
  const onClickExport = () => {
    Utils.shared.exportToZip()
  };
  return (
    <Button type="primary" onClick={onClickExport}>
      Export To Zip File
    </Button>
  );
}

function ExportToStringCatalogView() {
  const onClickExport = () => {
    Utils.shared.exportToStringCatalog().then(r => {
    })
  };
  return (
    <Button type="primary" onClick={onClickExport}>
      Export To String Catalog
    </Button>
  );
}

function SelectApplicationButton() {

  const selectedApplication = useSelector((state: RootState) => state.selectedApplication.value);
  const applications = useSelector((state: RootState) => state.user?.value?.applications || []);
  const dispatch = useAppDispatch()

  function makeDropDownSource() {
    const items = applications.map(application => {
      return {
        key: application.id,
        label: <Typography onClick={() => {
          dispatch(setSelectApplication(application))
        }}>{application.name}</Typography>
      }
    })

    return {
      items: items
    }
  }

  return (
    <Dropdown menu={makeDropDownSource()}
              trigger={['click']}

    >
      <Button>{selectedApplication ? selectedApplication.name : 'Select Application'}</Button>
    </Dropdown>
  )
}

function LogoutButton() {
  const navigate = useNavigate()
  return <Button
    type='text'
    style={{color: 'white', fontWeight: 'bold'}}
    title='Logout'
    icon={<LogoutOutlined/>}
    onClick={() => {
      AuthService.shared.logout()
      navigate('/login', {})
    }}
  >
    Logout
  </Button>
}

function HeaderView() {

  return (
    <div
      style={{
        height: "8vh",
        maxHeight: "8vh",
        textAlign: "center",
        // justifyContent: "center",
        display: "flex",
      }}
    >
      <Flex gap='small' align='center' justify='space-between' style={{width: '100%'}}>
        <SelectApplicationButton/>

        <Flex gap="small" align="center">
          <ImportNewWord/>
          <SelectPreferLanguageView/>
          <ExportToStringZip/>
          <ExportToStringCatalogView/>
          <LogoutButton/>
        </Flex>
      </Flex>

    </div>
  );
}

export default HeaderView;
