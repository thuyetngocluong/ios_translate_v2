import React from "react";
import {ExcelInfo} from "../../models/ExcelInfo";
import {Tabs} from "antd";


function TabView(info: ExcelInfo[]) {
  return <Tabs
    items={ info.map(e => {
      return {
        key: e.url,
        label: e.name
      }
    })}
  />
}

export default TabView