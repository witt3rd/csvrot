import Papa from "papaparse";

const Types = {
  INT: 0,
  FLOAT: 1,
  STRING: 2,
  BOOLEAN: 3,
  DATE: 4,
  JSON: 5
};

const tryParse = (list, type) => {
  try {
    const parseResults = Papa.parse(list, { dynamicTyping: true });
    const rawList = parseResults.data[0];
    const typedList = rawList.map(x => {
      switch (type) {
        case Types.BOOLEAN:
          return x === true;
        case Types.DATE:
          return x;
        case Types.FLOAT:
          return parseFloat(x);
        case Types.INT:
          return parseInt(x);
        case Types.JSON:
          return x;
        case Types.STRING:
          return x;
      }
    });
    console.log(typedList);
    return typedList;
  } catch (error) {
    console.log("Exception", error);
  }
  return [];
};

tryParse("1,2,3", Types.INT);
tryParse("1.1,2.2,3.3", Types.FLOAT);
tryParse("a,b,c", Types.STRING);
tryParse("true,true,false", Types.BOOLEAN);
tryParse('"01/01/2001","02/02/2002","03/03/2003"', Types.DATE);
tryParse('"{""foo":""bar""}","{""baz"":true,"{""qux"":3.14}"', Types.JSON);
tryParse('"{""foo":{""baz"":true,""qux"":3.14}}"', Types.JSON);

tryParse("l;,844&", Types.INT);
