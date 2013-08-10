//
//  LocPlugin.m
//  D2DPro
//
//  Created by Anne Roth on 13-08-09.
//
//

#import "LocPlugin.h"
#import "AppDelegate.h"
#import "LocationGrabberBackground.h"
@implementation LocPlugin

- (void)intervalUpdate:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Setting location(ObjC)");
    
    AppDelegate* appdel = [[UIApplication sharedApplication] delegate];
    [appdel.locGrabber locationFrequency:[command.arguments objectAtIndex:0]];
    [appdel.locGrabber setUserID:[command.arguments objectAtIndex:1]];
    [appdel.locGrabber setDevid:[command.arguments objectAtIndex:2]];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Success"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}
@end
