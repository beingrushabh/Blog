import React from "react";
import { Redirect } from "react-router-dom";

function ProtactedRoute({ component, ...rest }) {
  const Component = component;
  let loggedIn = sessionStorage.getItem("loggedIn");
  console.log(rest.id);
  return loggedIn === "true" ? (
    <Component {...rest} id={rest.id} />
  ) : (
    <Redirect
      to={{
        pathname: "/login",
        state: rest.path,
      }}
    />
  );
}
export default ProtactedRoute;
