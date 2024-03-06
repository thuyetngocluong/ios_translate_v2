import {Modal, Button, Input} from 'antd';
import {useEffect, useState} from 'react';
import {ExcelInfo} from "../../models/ExcelInfo";

// Example component
const CreateLink = (props: {
  isVisible: boolean,
  okAction: (info: ExcelInfo) => void
  cancelAction: () => void
}) => {

  const excelInfo = (localStorage.getItem("excel_info") || []) as ExcelInfo[]
  const [name, setName] = useState("")
  const [link, setLink] = useState("")

  return (
    <div style={{ alignItems: 'center', justifyItems: 'center', display: 'flex' }}>
      <Modal
        title="Import Excel"
        open={props.isVisible}
        okButtonProps={{
          disabled: !(name.trim().length !== 0 && link.trim().length !== 0 && !excelInfo.some(info => {
            return info.url === link.trim()
          }))
        }}
        onOk={() => { props.okAction({name: name, url: link}) }}
        onCancel={props.cancelAction}
      >
        <br/>
        <Input placeholder="Name" value={name} onChange={name => setName(name.target.value)}/>
        <br/>
        <br/>
        <Input placeholder="Link" value={link} onChange={link => setLink(link.target.value)} />
        <br/>
        <br/>

      </Modal>
    </div>
  );
};

export default CreateLink;
