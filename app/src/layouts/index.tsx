import React, { ReactChildren, useState } from 'react';
import styles from './index.css';
import {Link} from 'react-router-dom'

import { Layout, Menu, Breadcrumb, Icon, List } from 'antd';

const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;


const iconStyle = {
  fontSize: '36px',
  color: '#fff',
}

const BasicLayout = (props: {children: ReactChildren}) => {
  const [collapsed, setCollapsed] = useState(true);

  const onCollapse = (collapsed:boolean) => {
    console.log(collapsed);
    setCollapsed(collapsed);
  };

  const jump = (page:string) => {
    return (e) => {
      console.log(e, props);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
        <div className="logo" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
          <Menu.Item key="1" onClick={jump('page')}>
            <Link to="/files">
              <Icon type="pie-chart" />
              <span>Option 1</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Icon type="desktop" />
            <span>Option 2</span>
          </Menu.Item>
          <SubMenu
            key="sub1"
            title={
              <span>
                <Icon type="user" />
                <span>User</span>
              </span>
            }
          >
            <Menu.Item key="3">Tom</Menu.Item>
            <Menu.Item key="4">Bill</Menu.Item>
            <Menu.Item key="5">Alex</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="team" />
                <span>Team</span>
              </span>
            }
          >
            <Menu.Item key="6">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu>
          <Menu.Item key="9">
            <Icon type="file" />
            <span>File</span>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
      {/*
        <Sider style={{background:'#fff', borderRight:'1px solid #eee'}}>
          <Menu defaultSelectedKeys={['2']} mode="inline">
            <Menu.Item key="1" >
              文件一号
            </Menu.Item>
            <Menu.Item key="2" >
              文件2号
            </Menu.Item>
          </Menu>
        </Sider>*/}
        <Content style={{ margin: '16px 16px 0' }}>
          <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
            {props.children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default BasicLayout;
