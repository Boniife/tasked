export default function MkdSDK() {
  this._baseurl = "https://reacttask.mkdlabs.com";
  this._project_id = "reacttask";
  this._secret = "d9hedycyv6p7zw8xi34t9bmtsjsigy5t7";
  this._table = "";
  this._custom = "";
  this._method = "";

  const raw = this._project_id + ":" + this._secret;
  let base64Encode = btoa(raw);

  this.setTable = function (table) {
    this._table = table;
  };
  
  this.login = async function (email, password, role) {
    const url = this._baseurl + "/v2/api/lambda/login";
    const headers = {
      "Content-Type": "application/json",
      "x-project": base64Encode,
    };
    const body = JSON.stringify({
      email: email,
      password: password,
      role: role,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error("Login failed");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token);
    return data;
  };

  this.getHeader = function () {
    return {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "x-project": base64Encode,
    };
  };

  this.baseUrl = function () {
    return this._baseurl;
  };
  
  this.callRestAPI = async function (payload, method) {
    const header = {
      "Content-Type": "application/json",
      "x-project": base64Encode,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };

    switch (method) {
      case "GET":
        const getResult = await fetch(
          this._baseurl + `/v1/api/rest/${this._table}/GET`,
          {
            method: "post",
            headers: header,
            body: JSON.stringify(payload),
          }
        );
        const jsonGet = await getResult.json();

        if (getResult.status === 401) {
          throw new Error(jsonGet.message);
        }

        if (getResult.status === 403) {
          throw new Error(jsonGet.message);
        }
        return jsonGet;
      
      case "PAGINATE":
        const paginateUrl = this._baseurl + `/v1/api/rest/${this._table}/PAGINATE`;
        const paginateHeaders = {
          ...header,
          Authorization: "Bearer " + localStorage.getItem("token"),
        };

        const paginateBody = JSON.stringify({
          payload: payload.payload,
          page: payload.page,
          limit: payload.limit,
        });

        const paginateResult = await fetch(paginateUrl, {
          method: "POST",
          headers: paginateHeaders,
          body: paginateBody,
        });

        const jsonPaginate = await paginateResult.json();

        if (!paginateResult.ok) {
          throw new Error(jsonPaginate.message);
        }

        return jsonPaginate;
      
      default:
        break;
    }
  };  

  this.check = async function (role) {
    const url = this._baseurl + "/v2/api/lambda/check";
    const headers = {
      "Content-Type": "application/json",
      "x-project": base64Encode,
      Authorization: "Bearer " + localStorage.getItem("token"),
    };
    const body = JSON.stringify({
      role: role,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: headers,
      body: body,
    });

    if (!response.ok) {
      throw new Error("Check failed");
    }
  };

  return this;
}
