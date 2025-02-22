import {
  handleRequest,
  validateValueRequired,
} from "@hyperpaas/hyper-biz-controller/services";

function validateAppId(appId) {
  return validateValueRequired(appId, "appId is required!");
}

function validateAppUk(uk) {
  return validateValueRequired(uk, "uk is required!");
}

// 查询应用列表
export function listApps() {
  return handleRequest("/workspace/app/appList");
}

// 列出当前应用下所有的应用管理员
export function listAppAdmin(appUniqueKey, platformRole = "WS_APP_ADMIN") {
  return validateAppUk(appUniqueKey).then(() =>
    handleRequest("/account/platform/appRole/query", {
      appUniqueKey,
      platformRole,
    })
  );
}

// 为应用添加管理员
export function addAppAdmin(payload = {}) {
  return handleRequest(
    "/account/platform/role/add",
    { content: payload },
    { method: "post" }
  );
}

// 为应用移除管理员
export function removeAppAdmin(payload = {}) {
  return handleRequest("/account/platform/role/remove", payload, {
    method: "post",
  });
}
