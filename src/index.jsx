import { Col, Dropdown, Menu, message, Row, Space } from "antd";
import { useCallback, useLayoutEffect, useState } from "react";

import FitIcon from "@hp-view/fit-icon";
import { DEF_VIEW_ICON_SCHEMA } from "@/common/const";
import { listApps } from "@/services/index";

import "@/assets/style/index.less";

const itemLayoutDefs = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 6,
};

export default function Page() {
  const [appList, setAppList] = useState([]);

  const getAppList = useCallback(function () {
    listApps().then((res) => {
      const { content } = res || {};
      if (!content) {
        return message.error("获取应用列表失败");
      }
      const _appList = content.map((row) => {
        const iconProps = {
          ...DEF_VIEW_ICON_SCHEMA,
          ...(row?.appIcon || {}),
        };

        return {
          ...row,
          iconProps,
        };
      });

      setAppList(_appList);
    });
  }, []);

  function getMenu(item) {
    const { id, change, uniqueKey } = item || {};

    const { status } = change || {};
    const menus = [
      // {
      //   key: 'auth',
      //   label: (
      //     <a
      //       rel="noopener noreferrer"
      //       href={`/studio/auth/app/${uniqueKey}`}
      //       target="_blank"
      //     >
      //       预览授权
      //     </a>
      //   ),
      // },
      // {
      //   key: 'delete',
      //   label: (
      //     <a
      //       onClick={(e) => handleDeleteApp(id, e)}
      //     >
      //       删除应用
      //     </a>
      //   ),
      // },
    ];

    if (status !== "NEW") {
      menus.unshift({
        key: "workspace",
        label: (
          <a
            rel="noopener noreferrer"
            href={`/workspace/app/${uniqueKey}`}
            target="_blank"
          >
            查看应用
          </a>
        ),
      });
    }
    return <Menu items={menus} />;
  }

  useLayoutEffect(function () {
    getAppList();
  }, []);

  return (
    <>
      <div style={{ width: "100%" }} className={ROOT_ELEMENT}>
        <div className="applist-list-container">
          <Row gutter={20}>
            {appList.map((row) => {
              const { uniqueKey, label, iconProps, description } = row;

              return (
                <Col
                  key={uniqueKey}
                  style={{ marginTop: 20 }}
                  {...itemLayoutDefs}
                >
                  <div className="clearfix applist-item">
                    <div className="applist-item-icon">
                      <FitIcon {...iconProps} />
                    </div>
                    <div className="applist-item-info">
                      <h3 className="info-appname">
                        <a href={`/studio/app/${uniqueKey}`} target="_blank">
                          {label}
                        </a>
                      </h3>
                      <p className="info-desc">{description}</p>
                    </div>

                    <div className="applist-item-dropdown">
                      <Dropdown
                        overlay={getMenu(row)}
                        style={{ float: "right" }}
                      >
                        <Space>
                          <a
                            className="btn-trigger-dropdown"
                            onClick={(e) => e.preventDefault()}
                          >
                            <iconpark-icon
                              name="more"
                              size="20"
                            ></iconpark-icon>
                          </a>
                        </Space>
                      </Dropdown>
                    </div>
                  </div>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>

      {/* <RenderAppAdminManage appUniqueKey={uniqueKey} /> */}
    </>
  );
}
