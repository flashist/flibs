export class TimeoutTools {
    static async asyncTimeout(timeout: number): Promise<void> {
        return new Promise(
            (resolve: Function) => {
                setTimeout(
                    () => {
                        resolve();
                    },
                    timeout
                );
            }
        )
    }
}