function randomizeType() {
    let randomNumber = Math.floor(Math.random() * 7);
    let type;
    switch (randomNumber) {
        case 0:
            type = 'O';
            break;
        case 1:
            type = 'I';
            break;
        case 2:
            type = 'J';
            break;
        case 3:
            type = 'L';
            break;
        case 4:
            type = 'T';
            break;
        case 5:
            type = 'Z';
            break;
        case 6:
            type = 'S';
            break;
        default:
            type = 'error';
            break;
    }
    return type;
}

export {randomizeType};
