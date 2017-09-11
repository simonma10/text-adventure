import Controller from './controller';

test('data is loaded from url', () => {
    let url = 'http://localhost:8080/data/globals.json';
    //expect.assertions(1);
    return Controller.loadDataFile(url).then(response => {
        expect.objectContaining(
            {config : expect.anything()},
            {messages : expect.anything()}
            );

    });
});
