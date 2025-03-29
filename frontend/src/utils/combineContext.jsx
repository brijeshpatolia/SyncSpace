export default function combineContext(...providers) {
    
    return ({ children }) => {
        return providers.reduceRight((accumulator, Currentprovider) => {
            return <Currentprovider>{accumulator}</Currentprovider>;
        }, children /* Initial Value */);
    };
}


