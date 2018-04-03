export function decreaseOneSecond(params){
    let parking2DArray = params;
    for(let i=0; i<parking2DArray.length; i++){
        for(let j=0; j<parking2DArray[i].length; j++){
            if(parking2DArray[i][j] > 0)
                parking2DArray[i][j] = parking2DArray[i][j] - 1;
        }
    }
    return parking2DArray;
}