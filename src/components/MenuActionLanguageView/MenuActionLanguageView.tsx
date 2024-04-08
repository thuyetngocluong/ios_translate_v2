import React from "react";
import {Dropdown, MenuProps} from "antd";

const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
        1st menu item
      </a>
    ),
  },
  {
    key: '2',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
        2nd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '3',
    label: (
      <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
        3rd menu item (disabled)
      </a>
    ),
    disabled: true,
  },
  {
    key: '4',
    danger: true,
    label: 'a danger item',
  },
];

function MenuActionLanguageView(props: { text: string}) {
  return <Dropdown menu={{items}} trigger={['contextMenu']}>
    {/*<div style={{*/}
    {/*  // position: 'absolute',*/}
    {/*  // top: 0,*/}
    {/*  // left: 0,*/}
    {/*  // right: 0,*/}
    {/*  // bottom: 0,*/}

    {/*}}>*/}
    {/* OK*/}
    {/*</div>*/}
    <p style={{
      position: 'absolute',
      top: 0,
      left: 10,
      right: 10,
      bottom: 0,
    }}></p>
  </Dropdown>
}


export default MenuActionLanguageView;