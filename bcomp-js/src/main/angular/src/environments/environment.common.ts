import { environment as env0 } from "./environment"
import { environment as envChild } from "./environment.nochild"

export function merge(env, e){
  for(let key in e){
    if(!e.hasOwnProperty(key))
      continue;
    env[key] = e[key];
  }
  return env;
}

let env = env0;
env = merge(env, envChild);

export const environment = env;
