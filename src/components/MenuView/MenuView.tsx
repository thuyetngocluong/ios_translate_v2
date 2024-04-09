import React from 'react';
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../redux/store";
import {ItemType} from "antd/es/menu/hooks/useItems";
import AuthService from '../../services/AuthService';
import { Language } from '../../models/Language';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as ItemType;
}


interface MenuViewProps {
  languages: Language[],
  onSelectLanguageCode: (languageCode: string) => void
}
const MenuView = (props: MenuViewProps) => {

  const dispatch = useDispatch();

  function items(l: Language[]): MenuProps["items"] {
    return l.map(localization => getItem(`${localization.language_name} - ${localization.language_code}`, localization.language_code)) || []
  }

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    props.onSelectLanguageCode(e.key)
  };

  return (
    <Menu 
      onClick={onClick}
      style={{ textAlign: 'left', maxHeight: '100%', overflowY: 'auto', backgroundColor: 'white' }}
      defaultSelectedKeys={['en']}
      defaultOpenKeys={['en']}
      mode="inline"
      items={items(props.languages)}
    />
  );
};

export default MenuView;