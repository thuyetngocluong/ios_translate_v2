import React from 'react'
import {Popover, Table} from "antd";
import ExcelResult from "../../models/ExcelResult";
import {ToastContainer, toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


function ResultView(result: ExcelResult) {
  const convertToCatalog = () => {}
  const convertToZip = () => {}
  const convertRemoteConfigLocalization = () => {}

  function createSequenceArray(start: number, end: number) {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }

  function makeDataSource() {
    let r = []
    for (let rowIdx = 3; rowIdx < result.matrix.length; rowIdx ++) {
      let row = result.matrix[rowIdx]
      let rs: any = {};
      let sequence = [1, 0, ...createSequenceArray(2, result.matrix[0].length - 1)]
      rs["key"] = rowIdx.toString()
      for (let i = 0; i < sequence.length; i++) {
        rs[result.matrix[0][i]] = row[i]

      }
      r.push(rs)
    }
    return r
  }

  const notify = (message: string) => toast.success(message);

    return <div>
    <button className="Button" onClick={convertToCatalog} >String Catalog</button>
    <button className="Button" onClick={convertToZip} >Zip File</button>
    <button className="Button" onClick={convertRemoteConfigLocalization} >Remote Config</button>
      <ToastContainer hideProgressBar={true} newestOnTop={true}/>
    <Table
      columns={
      [1, 0, ...createSequenceArray(2, result.matrix[0].length-1)]
        .map(idx=> {
            return {
              title: result.matrix[0][idx],
              dataIndex: result.matrix[0][idx],
              key: idx.toString(),
              render: (text, record, i) => {
                console.log(text, record.Keys)
                return (
                <div onClick={() => {
                  notify(`Copied: "${record.Keys}" = ${JSON.stringify(text)}`)
                  navigator.clipboard.writeText(`"${record.Keys}" = ${JSON.stringify(text)}`)
                }} >
                  <p>{text}</p>
                </div>
              )},
            }
          }
        )
      }

      dataSource={makeDataSource()}
    />
  </div>
}

export default ResultView;