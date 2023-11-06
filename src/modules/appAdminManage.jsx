import { useState, useEffect } from "react";
import { message, Modal, Select } from "antd";

import { addAppAdmin, removeAppAdmin, listAppAdmin } from "@/services";
import modalPersonPicker from "@hp-view/com-person-picker";
import { MODAL_SIZE_S_WIDTH } from "@/common/const";

function AppAdminManage(props) {
  const { visible, item, onCancel } = props || {};
  const { uniqueKey: appUniqueKey } = item || {};

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
      selectedItems: _selectedItems,
      onConfirm: handleAddAppAdmin,
    });
  };

  const handleAddAppAdmin = (selectedVal) => {
    if (!selectedVal?.length) {
      return;
    }

    const payload = selectedVal.map((item) => ({
      platformRole: "WS_APP_ADMIN",
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
      platformRole: "WS_APP_ADMIN",
      applicationUniqueKey: appUniqueKey,
      accountId,
    };

    if (developers.length === 1) {
      return message.info("至少需要保留一位应用管理员～");
    }

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
    <Modal
      visible={visible}
      title="应用管理"
      width={MODAL_SIZE_S_WIDTH}
      okText="确定"
      cancelText="取消"
      onCancel={onCancel}
      onOk={onCancel}
    >
      <p style={{ marginBottom: 8, color: "#000000d9" }}>设置应用管理员</p>
      {/* !todo 下拉选择框人员多的情况下，移除后面的人不方便,后续自行比较变更人员 */}
      <Select
        style={{ width: "100%" }}
        mode="multiple"
        open={false}
        maxTagCount="responsive"
        value={developers.map((item) => ({
          value: item.accountId,
          label: item.accountName,
        }))}
        onClick={showPersonPicker}
        onDeselect={handleRemoveAppAdmin}
      />
    </Modal>
  );
}

export default AppAdminManage;
