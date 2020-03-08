import { GUIObjectManager } from "./object-manager";
import { aluInMul, bottomBusY, busWidth, canvasHeight, leftRegsBusX, rightRegsBusX } from "./gui-constraints";

export enum Buses {
  BR_ALU,
  COMM_BR,
  PS_ALU,
  COMM_PS,
  COMM_ALL,
  ALU_COMM,
  DR_ALU,
  CR_ALU,
  IP_ALU,
  SP_ALU,
  AC_ALU,
  IR_ALU,
  COMM_AR,
  COMM_DR,
  COMM_CR,
  COMM_IP,
  COMM_SP,
  COMM_AC,
  MEM_IO,
  MEM_R,
  MEM_W,
  CU
}

let b = {};

function centerRegToALUPnts(om: GUIObjectManager, regName: string, left: boolean){
  const ALU = om.get("ALU");
  const reg = om.get(regName);

  const aluX = (left ? aluInMul : 1 - aluInMul) * ALU.width;

  return [
    [ reg[left ? "right" : "left"], reg.vCenter ],
    [ ALU.left + aluX,              reg.vCenter ],
    [ ALU.left + aluX,              ALU.top     ]
  ];
}

b[Buses.AC_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "AC", true);
};
b[Buses.BR_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "BR", true);
};
b[Buses.PS_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "PS", true);
};
b[Buses.IR_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "IR", true);
};


b[Buses.DR_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "DR", false);
};
b[Buses.CR_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "CR", false);
};
b[Buses.IP_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "IP", false);
};
b[Buses.SP_ALU] = function(om: GUIObjectManager){
  return centerRegToALUPnts(om, "SP", false);
};



b[Buses.MEM_R] = function(om: GUIObjectManager){
  const MEM = om.get("MEM");
  const DR = om.get("DR");
  return [
    [ MEM.left,               MEM.top + MEM.height*0.03 ],
    [ DR.left + DR.width*0.5, MEM.top + MEM.height*0.03 ],
    [ DR.left + DR.width*0.5, DR.top                    ]
  ];
};
b[Buses.MEM_W] = function(om: GUIObjectManager){
  const MEM = om.get("MEM");
  const DR = om.get("DR");
  return [
    [ DR.left + DR.width*0.6, DR.top                    ],
    [ DR.left + DR.width*0.6, MEM.top + MEM.height*0.08 ],
    [ MEM.left,               MEM.top + MEM.height*0.08 ]
  ];
};



b[Buses.ALU_COMM] = function(om: GUIObjectManager){
  const ALU = om.get("ALU");
  const COMM = om.get("COMM");
  return [
    [ALU.hCenter,   ALU.bottom ],
    [COMM.hCenter,  COMM.top   ]
  ];
};



b[Buses.COMM_ALL] = function(om: GUIObjectManager){
  const COMM = om.get("COMM");
  return [
    [ COMM.hCenter, COMM.bottom                          ],
    [ COMM.hCenter, bottomBusY - busWidth/canvasHeight/2 ],
  ]
};

function commToRegsPnts(om: GUIObjectManager, regName: string, left: boolean){
  const COMM = om.get("COMM");
  const reg = om.get(regName);

  const regsX = (left ? leftRegsBusX : rightRegsBusX);

  return [
    [ COMM.hCenter,                 bottomBusY  ],
    [ regsX,                        bottomBusY  ],
    [ regsX,                        reg.vCenter ],
    [ reg[left ? "left" : "right"], reg.vCenter ]
  ];
}

b[Buses.COMM_AC] = function(om: GUIObjectManager){
  return commToRegsPnts(om, "AC", true);
};
b[Buses.COMM_BR] = function(om: GUIObjectManager){
  return commToRegsPnts(om, "BR", true);
};
b[Buses.COMM_PS] = function(om: GUIObjectManager){
  return commToRegsPnts(om, "PS", true);
};


b[Buses.COMM_DR] = function(om: GUIObjectManager){
  return commToRegsPnts(om, "DR", false);
};
b[Buses.COMM_CR] = function(om: GUIObjectManager){
  return commToRegsPnts(om, "CR", false);
};
b[Buses.COMM_IP] = function(om: GUIObjectManager){
  return commToRegsPnts(om, "IP", false);
};
b[Buses.COMM_SP] = function(om: GUIObjectManager){
  return commToRegsPnts(om, "SP", false);
};
b[Buses.COMM_AR] = function(om: GUIObjectManager){
  const COMM = om.get("COMM");
  const AR = om.get("AR");

  return [
    [ COMM.hCenter, bottomBusY ],
    [ AR.left,      AR.vCenter ]
  ];
};


b[Buses.CU] = function(om: GUIObjectManager){
  const COMM = om.get("COMM");
  const CU = om.get("CU");
  return [
    [ COMM.hCenter, bottomBusY ],
    [ CU.hCenter,   bottomBusY ],
    [ CU.hCenter,   CU.bottom  ]
  ];
};

b[Buses.MEM_IO] = function(om: GUIObjectManager){
  const AR = om.get("AR");
  const MEM = om.get("MEM");
  return [
    [ MEM.hCenter, AR.top     ],
    [ MEM.hCenter, MEM.bottom ],
  ]
};

export const buses = b;
