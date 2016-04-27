'use strict';

import React, { requireNativeComponent, EdgeInsetsPropType, PropTypes, StyleSheet, UIManager, View } from 'react-native';
import invariant from 'react-native/node_modules/fbjs/lib/invariant';
import keyMirror from 'react-native/node_modules/fbjs/lib/keyMirror';
var { NativeModules: { WKWebViewManager: { supported, JSNavigationScheme, NavigationType } } } = React;

var RCT_WEBVIEW_REF = 'webview';

var WKWebViewState = keyMirror({
    ERROR:   null,
    IDLE:    null,
    LOADING: null
});

var styles = StyleSheet.create({
    container: {
        flex: 1
    },
    hidden:    {
        flex:   0, // disable 'flex:1' when hiding a View
        height: 0
    }
});

var WKWebView = React.createClass({
    statics:   {
        JSNavigationScheme: JSNavigationScheme,
        NavigationType:     {
            backforward:  NavigationType.BackForward,
            click:        NavigationType.LinkActivated,
            formresubmit: NavigationType.FormResubmitted,
            formsubmit:   NavigationType.FormSubmitted,
            other:        NavigationType.Other,
            reload:       NavigationType.Reload
        },
        supported:          supported
    },
    propTypes: {
        automaticallyAdjustContentInsets: PropTypes.bool,
        bounces:                          PropTypes.bool,
        contentInset:                     EdgeInsetsPropType,
        html:                             PropTypes.string,
        onError:                          PropTypes.func,
        onLoad:                           PropTypes.func,
        onLoadEnd:                        PropTypes.func,
        onLoadStart:                      PropTypes.func,
        onNavigationStateChange:          PropTypes.func,
        renderError:                      PropTypes.func,
        renderLoading:                    PropTypes.func,
        scalesPageToFit:                  PropTypes.bool,
        scrollEnabled:                    PropTypes.bool,
        startInLoadingState:              PropTypes.bool,
        style:                            View.propTypes.style,
        url:                              PropTypes.string
    },
    getInitialState () {
        return {
            lastErrorEvent:      null,
            startInLoadingState: true,
            viewState:           WKWebViewState.IDLE
        };
    },
    render () {
        var { automaticallyAdjustContentInsets, bounces, contentInset, html, renderError, renderLoading, scalesPageToFit, scrollEnabled, style, url } = this.props;
        var { lastErrorEvent, loading, viewState } = this.state;
        var overlay, webViewStyles;

        if (viewState === WKWebViewState.LOADING) {
            overlay = renderLoading && renderLoading();
        }
        else if (viewState === WKWebViewState.ERROR) {
            invariant(lastErrorEvent != null, 'lastErrorEvent expected to be non-null');
            overlay = renderError && renderError(lastErrorEvent.domain, lastErrorEvent.code, lastErrorEvent.description);
        }
        else if (viewState !== WKWebViewState.IDLE) {
            console.error('RCTWKWebView invalid state encountered: ' + loading);
        }

        webViewStyles = [styles.container, style];
        if (viewState === WKWebViewState.LOADING ||
            viewState === WKWebViewState.ERROR) {
            webViewStyles.push(styles.hidden);
        }

        return (
            <View style={ styles.container }>
                <RCTWKWebView
                    automaticallyAdjustContentInsets={ automaticallyAdjustContentInsets }
                    bounces={ bounces }
                    contentInset={ contentInset }
                    html={ html }
                    key="webViewKey"
                    onLoadingError={ this.onLoadingError }
                    onLoadingFinish={ this.onLoadingFinish }
                    onLoadingStart={ this.onLoadingStart }
                    ref={ RCT_WEBVIEW_REF }
                    scalesPageToFit={ scalesPageToFit }
                    scrollEnabled={ scrollEnabled }
                    style={ webViewStyles }
                    url={ url }/>
                { overlay }
            </View>
        );
    },
    getWebViewHandle () {
        return React.findNodeHandle(this.refs[RCT_WEBVIEW_REF]);
    },
    componentWillMount () {
        if (this.props.startInLoadingState) {
            this.setState({ viewState: WKWebViewState.LOADING });
        }
    },
    onLoadingError (event) {
        event.persist(); // persist this event because we need to store it
        var { onError, onLoadEnd } = this.props;
        onError && onError(event);
        onLoadEnd && onLoadEnd(event);
        console.warn('Encountered an error loading page', event.nativeEvent);
        this.setState({
            lastErrorEvent: event.nativeEvent,
            viewState:      WKWebViewState.ERROR
        });
    },
    onLoadingFinish (event) {
        var { onLoad, onLoadEnd } = this.props;
        onLoad && onLoad(event);
        onLoadEnd && onLoadEnd(event);
        this.setState({ viewState: WKWebViewState.IDLE });
        this.updateNavigationState(event);
    },
    onLoadingStart (event) {
        var onLoadStart = this.props.onLoadStart;
        onLoadStart && onLoadStart(event);
        this.updateNavigationState(event);
    },
    goBack () {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTWKWebView.Commands.goBack,
            null
        );
    },
    goForward () {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTWKWebView.Commands.goForward,
            null
        );
    },
    reload () {
        UIManager.dispatchViewManagerCommand(
            this.getWebViewHandle(),
            UIManager.RCTWKWebView.Commands.reload,
            null
        );
    },
    updateNavigationState (event) {
        if (this.props.onNavigationStateChange) {
            this.props.onNavigationStateChange(event.nativeEvent);
        }
    }
});
/*eslint-enable react/no-multi-comp*/

/*eslint-disable no-unused-vars*/
var RCTWKWebView = requireNativeComponent('RCTWKWebView', WKWebView, {
    nativeOnly: {
        onLoadingStart:  true,
        onLoadingError:  true,
        onLoadingFinish: true
    }
});
/*eslint-enable no-unused-vars*/

export default WKWebView;
