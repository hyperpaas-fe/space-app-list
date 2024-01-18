import { Col, Dropdown, Menu, Row, Space } from "antd";
import { useCallback, useLayoutEffect, useState } from "react";
import { More } from "@icon-park/react";

import FitIcon from "@hp-view/fit-icon";

import { DEF_VIEW_ICON_SCHEMA } from "@/common/const";
import { listApps } from "@/services/index";

import RenderAppAdminManage from "@/modules/appAdminManage";
import "@/assets/style/index.less";

const itemLayoutDefs = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
};

// 忽略新日APP
const ignoreApps = [
  "abf26cc8c77849dfa8a108e03c44e4ee",
  "7871f37a9eb1438fb89baecfe8ed96ee",
  "020c4d385f5f472086ddc9ffa6e33264",
];

export default function Page() {
  const [appList, setAppList] = useState([]);
  const [activeItem, setActiveItem] = useState({});
  const [visibleAppManage, setVisibleAppManage] = useState(false);

  const getAppList = useCallback(() => {
    listApps().then((res) => {
      const { content } = res || {};
      const list = [];
      content &&
        content.forEach((row) => {
          const { uniqueKey, appIcon = {} } = row || {};
          if (ignoreApps.includes(uniqueKey)) {
            return false;
          }
          const iconProps = {
            ...DEF_VIEW_ICON_SCHEMA,
            ...appIcon,
          };
          list.push({
            ...row,
            iconProps,
            appUrl: `/workspace/app/${uniqueKey}`,
          });
        });
      setAppList(list);
    });
  }, []);

  function getMenus(item) {
    const { uniqueKey, permitManage } = item || {};
    const menus = [];

    if (permitManage) {
      menus.push({
        key: "auth",
        label: (
          <a
            rel="noopener noreferrer"
            href={`/workspace/app/${uniqueKey}/manage/auth`}
            target="_blank"
          >
            应用授权
          </a>
        ),
      });

      // 判断是否允许为当前应用配置管理员
      menus.push({
        key: "appManage",
        label: (
          <a
            onClick={() => {
              setActiveItem(item);
              setVisibleAppManage(true);
            }}
          >
            应用管理
          </a>
        ),
      });
    }

    return menus;
  }

  useLayoutEffect(function () {
    getAppList();
  }, []);

  return (
    <>
      <div style={{ width: "100%" }} className={ROOT_ELEMENT}>
        <div className="applist-portal-container">
          <Row gutter={20}>
            {appList.map((row) => {
              const { uniqueKey, label, appUrl, iconProps, description } = row;
              const menus = getMenus(row);
              const dropdownView =
                menus && menus.length ? (
                  <div className="applist-item-dropdown">
                    <Dropdown
                      overlay={<Menu items={menus} />}
                      style={{ float: "right" }}
                    >
                      <div className="trigger-icon-wrapper">
                        <More className="dropdown-trigger-icon" size={20} />
                      </div>
                    </Dropdown>
                  </div>
                ) : null;

              return (
                <Col
                  key={uniqueKey}
                  style={{ marginTop: 20 }}
                  {...itemLayoutDefs}
                >
                  <div className="clearfix applist-item">
                    <a
                      style={{ display: "flex" }}
                      href={appUrl}
                      target="_blank"
                    >
                      <div className="applist-item-icon">
                        <FitIcon {...iconProps} />
                      </div>
                      <div className="applist-item-info">
                        <h3 className="info-appname">{label}</h3>
                        <p className="info-desc">{description}</p>
                      </div>
                    </a>

                    {dropdownView}
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
        <RenderAppAdminManage
          item={activeItem}
          visible={visibleAppManage}
          onCancel={() => setVisibleAppManage(false)}
        />
      </div>
    </>
  );
}
