import React, { createContext, useState } from 'react';

const MyToken = createContext({
  myVariable: 'null',
  setMyVariable: () => {},
});

export default MyToken;
