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
#import "SVPlugin.h"
#import "AppDelegate.h"
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

- (void)presentView:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Displaying signature");
    NSString* name = @"";
    
    if(UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad){
        name=@"SVPlugin";
    }else{
        name=@"SVPlugin-iPhone";
        NSLog(@"Using iPhone");
    }
    SVPlugin * viewCtl = [[SVPlugin alloc] initWithNibName:name bundle:nil delegate:self];
    
    [[(AppDelegate*)[[UIApplication sharedApplication] delegate] viewController] presentModalViewController:viewCtl animated:YES];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Success"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)share:(CDVInvokedUrlCommand*)command
{
    NSLog(@"Sharing POS");
    NSString* position = [command argumentAtIndex:0];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:@"Success"];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
    NSArray *items = @[position];
    UIActivityViewController *activityVC = [[UIActivityViewController alloc] initWithActivityItems:items applicationActivities:nil];
    activityVC.excludedActivityTypes = @[UIActivityTypePrint, UIActivityTypeCopyToPasteboard]; //or whichever you don't need
    [[(AppDelegate*)[[UIApplication sharedApplication] delegate] viewController] presentViewController:activityVC animated:YES completion:nil];
    
}

@end
