import { Button, Dropdown, Flex, MenuProps, Modal } from "antd";
import LanguageService from "../../services/LanguageService";
import { useEffect, useState } from "react";
import { Language } from "../../models/Language";
import AuthService from "../../services/AuthService";
import SelectPreferLanguageView from "./SelectPreferLanguageView";
import ImportNewWord from "./ImportNewWord";
import { Utils } from "../../Utils/Utils";

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
    Utils.shared.exportToStringCatalog()
  };
  return (
    <Button type="primary" onClick={onClickExport}>
      Export To String Catalog
    </Button>
  );
}

function HeaderView() {
  return (
    <div
      style={{
        height: "8vh",
        maxHeight: "8vh",
        textAlign: "center",
        justifyContent: "center",
        display: "flex",
      }}
    >
      <Flex gap="small" align="center">
        <ImportNewWord/>
        <SelectPreferLanguageView />
        <ExportToStringZip />
        <ExportToStringCatalogView />
      </Flex>
    </div>
  );
}

export default HeaderView;
