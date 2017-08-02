export const INPUT_SUBMIT = 'INPUT_SUBMIT';
export const INPUT_PARSE = 'INPUT_PARSE';

export function inputSubmit (inputText) {
    return {
        type: INPUT_SUBMIT,
        payload: inputText
    }
}

export function inputParse () {
    return {
        type: INPUT_PARSE
    }
}
