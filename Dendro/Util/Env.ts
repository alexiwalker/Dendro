export class Env {

	public static Port(defaultPort:Number = 8000, envKey:string = "PORT"):Number{
		return parseInt(String(Deno.env.get(envKey))) || defaultPort;
	}

	public static Numeric(envKey:string, Default:Number = -1 ):Number{
		return parseInt(String(Deno.env.get(envKey))) || Default;
	}

}