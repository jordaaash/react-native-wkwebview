#import "RCTWKWebViewManager.h"

#import "RCTBridge.h"
#import "RCTUIManager.h"
#import "RCTWKWebView.h"
#import "UIView+React.h"

#import <WebKit/WebKit.h>

@implementation RCTWKWebViewManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RCTWKWebView new];
}

RCT_REMAP_VIEW_PROPERTY(url, URL, NSURL);
RCT_REMAP_VIEW_PROPERTY(html, HTML, NSString);
RCT_REMAP_VIEW_PROPERTY(bounces, _webView.scrollView.bounces, BOOL);
RCT_REMAP_VIEW_PROPERTY(scrollEnabled, _webView.scrollView.scrollEnabled, BOOL);
RCT_EXPORT_VIEW_PROPERTY(contentInset, UIEdgeInsets);
RCT_EXPORT_VIEW_PROPERTY(automaticallyAdjustContentInsets, BOOL);
RCT_EXPORT_VIEW_PROPERTY(onLoadingStart, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onLoadingFinish, RCTDirectEventBlock);
RCT_EXPORT_VIEW_PROPERTY(onLoadingError, RCTDirectEventBlock);

- (NSDictionary<NSString *, id> *)constantsToExport
{
  return @{
    @"supported": @(!!NSClassFromString(@"WKWebView")),
    @"JSNavigationScheme": RCTJSNavigationScheme,
    @"NavigationType": @{
      @"LinkActivated": @(WKNavigationTypeLinkActivated),
      @"FormSubmitted": @(WKNavigationTypeFormSubmitted),
      @"BackForward": @(WKNavigationTypeBackForward),
      @"Reload": @(WKNavigationTypeReload),
      @"FormResubmitted": @(WKNavigationTypeFormResubmitted),
      @"Other": @(WKNavigationTypeOther)
    },
  };
}

RCT_EXPORT_METHOD(goBack:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTWKWebView *> *viewRegistry) {
    RCTWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RCTWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RCTWKWebView, got: %@", view);
    } else {
      [view goBack];
    }
  }];
}

RCT_EXPORT_METHOD(goForward:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTWKWebView *> *viewRegistry) {
    RCTWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RCTWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RCTWKWebView, got: %@", view);
    } else {
      [view goForward];
    }
  }];
}

RCT_EXPORT_METHOD(reload:(nonnull NSNumber *)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary<NSNumber *, RCTWKWebView *> *viewRegistry) {
    RCTWKWebView *view = viewRegistry[reactTag];
    if (![view isKindOfClass:[RCTWKWebView class]]) {
      RCTLogError(@"Invalid view returned from registry, expecting RCTWKWebView, got: %@", view);
    } else {
      [view reload];
    }
  }];
}

@end
