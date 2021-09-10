import _ from 'lodash'

const isNotValid  = (val: any) => _.isUndefined(val) || _.isNull(val);
const notAllValid = (args: any) => _(args).some(isNotValid);

const a: boolean = notAllValid(['string', 0, null, undefined]);
const b: boolean = notAllValid(['string', 0, {}]);
console.log(`a`, a); // a true
console.log(`b`, b); // b false
