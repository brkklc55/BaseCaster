import sdk from '@farcaster/frame-sdk';
try {
    if (sdk.actions && typeof sdk.actions.ready === 'function') {
        console.log('sdk.actions.ready exists');
        sdk.actions.ready();
    } else {
        console.log('sdk.actions.ready MISSING');
        console.log('sdk keys:', Object.keys(sdk));
        if (sdk.actions) console.log('sdk.actions keys:', Object.keys(sdk.actions));
    }
} catch (e) {
    console.log('Error:', e);
}
