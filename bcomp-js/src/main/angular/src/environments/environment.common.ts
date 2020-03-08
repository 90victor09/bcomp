import { environment as env0 } from "./environment"
import { child } from "./environment.nochild"


let env: any = env0;
env["child"] = child;

export const environment = env;
