// move this to utils
export const timeout = (TimeInMs) => {
    return new Promise(resolve => setTimeout(resolve, TimeInMs));
}