(function (exports) {
    'use strict';

    exports.Logger = (function () {

        function _fadeIn(elem) {
            elem.style.opacity = 0;

            var tick = function tick() {
                elem.style.opacity = +elem.style.opacity + 0.01;

                /* jshint ignore:start */
                if ((+elem.style.opacity) < 1) {
                    (window.requestAnimationFrame && requestAnimationFrame(tick)) || setTimeout(tick, 16);
                }
                /* jshint ignore:end */
            };

            tick();
        }

        function log(message) {
            if (typeof console !== undefined) {
                console.log(message);
            }
        }

        function warn(message) {
            var elem = document.querySelector('[data-hook="console-warning"]'),
                debugInfo = 'Please open the console to view all warnings/errors that have been generated and debug any relevant code.',
                uiMessage = debugInfo + '\n\nLast warning logged: ' + message;

            if (typeof console !== undefined && typeof console.warn !== undefined) {
                console.warn(message);
            }

            if (elem != null) {
                elem.parentNode.removeChild(elem);
            }

            elem = document.createElement('div');

            elem.dataset.hook = 'console-warning';
            elem.style.position = 'absolute';
            elem.style.bottom = '1rem';
            elem.style.right = '1rem';
            elem.style.height = '64px';
            elem.style.width = '64px';
            elem.style.backgroundImage = 'url("imgs/warning.png")';
            elem.title = uiMessage;

            elem.addEventListener('click', function () {
                alert(uiMessage);
            });

            if (typeof document.body !== undefined &&
                document.body !== null &&
                typeof document.body.appendChild !== undefined &&
                document.body.appendChild !== null) {

                document.body.appendChild(elem);

                _fadeIn(elem);
            }
            else {
                alert('An error was encountered during page load. Please open the console to view all warnings/errors that have been generated and debug any relevant code.');
            }
        }

        return {
            log: log,
            warn: warn
        };

    }());

}(typeof exports !== 'undefined' && exports !== null ? exports : this));