export class Env {

	public static Port(defaultPort: Number = 8000, envKey: string = "PORT"): number {
		return (parseInt(String(Deno.env.get(envKey))) || defaultPort).valueOf();
	}

	public static Numeric(envKey: string, Default: Number = -1): Number {
		return parseInt(String(Deno.env.get(envKey))) || Default;
	}

}