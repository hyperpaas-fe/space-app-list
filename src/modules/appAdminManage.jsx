import { useState, useEffect } from "react";
import { message, Tag } from "antd";
import { addAppAdmin, removeAppAdmin, listAppAdmin } from "@/services";

import modalPersonPicker from "@hp-view/com-person-picker";

function AppAdminManage(props) {
  const { appUniqueKey } = props || {};

  const [developers, setDevelopers] = useState([]);

  const refreshAppAdminList = () => {
    appUniqueKey &&
      listAppAdmin(appUniqueKey).then((res) => {
        const { content } = res || {};
        if (!content) {
          return message.error("获取应用管理员失败");
        }
        setDevelopers(content);
      });
  };

  const _selectedItems = Array.isArray(developers)
    ? developers.map((item) => ({
        value: item.accountId,
        itemType: "account",
      }))
    : [];

  const showPersonPicker = () => {
    modalPersonPicker({
      enabledTypes: ["studioDeveloper"],
      selectedItems: _selectedItems,
      onConfirm: handleAddAppAdmin,
    });
  };

  const handleAddAppAdmin = (selectedVal) => {
    if (!selectedVal?.length) {
      return;
    }

    const payload = selectedVal.map((item) => ({
      platformRole: "STUDIO_APP_ADMIN",
      applicationUniqueKey: appUniqueKey,
      accountId: item.itemValue,
    }));

    addAppAdmin(payload).then((res) => {
      const { content } = res || {};
      if (content !== true) {
        return message.error("添加应用管理员失败");
      }
      refreshAppAdminList();
    });
  };

  const handleRemoveAppAdmin = (accountId) => {
    if (!accountId) return;

    const payload = {
      platformRole: "STUDIO_APP_ADMIN",
      applicationUniqueKey: appUniqueKey,
      accountId,
    };

    removeAppAdmin(payload).then((res) => {
      const { content } = res || {};
      if (content !== true) {
        return message.error("移除应用管理员失败");
      }
      refreshAppAdminList();
    });
  };

  useEffect(() => {
    refreshAppAdminList();
  }, [appUniqueKey]);

  return (
    <div
      className="studio-developer-selecter-container"
      onClick={showPersonPicker}
    >
      {developers.length
        ? developers.map((item) => {
            return (
              <Tag
                key={item.accountId}
                style={{ marginBottom: "4px" }}
                closable
                onClose={() => handleRemoveAppAdmin(item.accountId)}
              >
                {item.accountName}
              </Tag>
            );
          })
        : null}
    </div>
  );
}

export default AppAdminManage;
