function RemoveHtmlFromString(data){
    if(typeof(data)==="string"){
        return data.replace(/\s/g,' ').replace( /(<([^>]+)>)/ig, ' ')
    }else{
        return data
    }
}


export {RemoveHtmlFromString}