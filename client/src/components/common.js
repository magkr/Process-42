import React from "react";
import { getData } from "../store.js";
import Data from "./data.js"

export const dataShow = location => {
  var d = "{ var: 1 }"

  getData(location).then(res => d = JSON.stringify(res)).then();
  console.log(d);
  return (
    <div>
      <p>Data her: {d.value}</p>
    </div>
  );
};

export const dataEvent = (e, web3) => { // KAN LÆGGES UD I COMMON OG GENBRUGES TIL RESOLUTIONVIEW OG HISTORIK
  if (!e) return null;
  return (
    <div>
      <h3 className="b f5 ph1 pv1">
        <p>
          {web3.utils.hexToAscii(e.title)}
        </p>
      </h3>
      <div className="ph2">
        <Data location={e.location}/>
        </div>
    </div>
  );
}
