import React from "react";
import {FloatButton, Table} from "antd";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import "./LocalizationDetail.css"
import {Utils} from "../../Utils/Utils";

function LocalizationDetail() {

  const dispatch = useDispatch();
  const localizations = useSelector((state: RootState) => state.languageTranslate);

  function makeColumns() {
    let keyData = [
      {
        title: "#",
        dataIndex: "#",
        key: "#"
      },
      {
        title: "Key",
        dataIndex: "key",
        key: "key"
      }
    ]
    let languageData = localizations.map(localization =>{
        return {
          title: localization.languageName,
          dataIndex: localization.languageCode,
          key: localization.languageCode
      }
    })

    console.log("Column", [keyData, ...languageData])
    return [...keyData, ...languageData]
  }

  function makeDataSource() {
    if (!localizations[0] || !localizations[0].translate) {  return;  }
    let keys = localizations[0].translate.map(e => e.key)
    let dictionary: any = {}
    let dataSource = keys.map(key => {
      dictionary[key] = {
        key: key
      }
      return {
        key: key
      } as any
    })


    for (let i = 0; i < localizations.length; i++) {
      let languageTranslate = localizations[i]
      let code = languageTranslate.languageCode
      let translateData = languageTranslate.translate
      for(let j = 0; j < translateData.length; j++) {
        let key = translateData[j].key
        dictionary[key][code] = translateData[j].value
      }
    }

    for (let i = 0; i < dataSource.length; i ++) {
      dataSource[i] = dictionary[dataSource[i].key] || {}
      dataSource[i]["#"] = i + 1
    }
    console.log(dataSource)
    return dataSource
  }

  return <>
    <div>
      <FloatButton
        onClick={() => { Utils.shared.exportToStringCatalog(localizations) }}
        description="Export To String Catalog"
        type="primary"
        shape="square"
        style={{
          right: 24,
          width: 80,
          height: 80,
          fontWeight: 500,


      }}
      />

      <Table columns={makeColumns()} dataSource={makeDataSource()} className="localization-detail">

      </Table>
    </div>

  </>
}


export default LocalizationDetail;