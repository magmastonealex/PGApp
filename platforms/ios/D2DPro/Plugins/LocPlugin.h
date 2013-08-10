//
//  LocPlugin.h
//  D2DPro
//
//  Created by Anne Roth on 13-08-09.
//
//

#import <Cordova/CDV.h>

@interface LocPlugin : CDVPlugin
- (void)intervalUpdate:(CDVInvokedUrlCommand*)command;
@end
