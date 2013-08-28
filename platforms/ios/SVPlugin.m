//
//  SignatureViewController.m
//  D2DPro
//
//  Created by Alex Roth on 2013-08-27.
//
//

#import "SVPlugin.h"
#import "LocPlugin.h"
#import "SignatureViewController.h"
#import "AppDelegate.h"
#import "NSData+Base64.h"
@interface SVPlugin ()
@property (retain, nonatomic) LocPlugin *delegate;
@property (retain, nonatomic) IBOutlet UIView *signatureView;
@property (retain, nonatomic) SignatureViewController * signatureController;
- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil delegate:(LocPlugin*) delegateI;
@end

@implementation SVPlugin
@synthesize signatureView, delegate;


- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil delegate:(LocPlugin*) delegateI;
{
    
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        delegate = delegateI;
    }
    return self;
}
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{

    return (interfaceOrientation == UIInterfaceOrientationPortrait || interfaceOrientation == UIInterfaceOrientationPortraitUpsideDown);
}
- (void)viewDidLoad
{
    [super viewDidLoad];
    [[UIApplication sharedApplication] setStatusBarOrientation:UIInterfaceOrientationLandscapeRight];
    self.signatureController = [[SignatureViewController alloc] initWithNibName:@"SignatureView" bundle:nil];
    self.signatureController.delegate = self;
    
    self.signatureController.view.frame = self.signatureView.frame;
    [self.view insertSubview:self.signatureController.view belowSubview:self.signatureView];
    [self.signatureView removeFromSuperview];
    self.signatureView = self.signatureController.view;
    // Do any additional setup after loading the view from its nib.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (void) signatureViewController:(SignatureViewController *)viewController didSign:(NSData *)signature;
{
    NSData *thisSignature = signature;
    NSString * sigstring = [NSString stringWithFormat:@"updatedSig('%@');", [thisSignature base64EncodedString]];
    sigstring = [sigstring stringByReplacingOccurrencesOfString:@"\n" withString:@""];
    sigstring = [sigstring stringByReplacingOccurrencesOfString:@"\r" withString:@""];
    [[[(AppDelegate*)[[UIApplication sharedApplication] delegate] viewController] webView] stringByEvaluatingJavaScriptFromString:sigstring];
    

    [[(AppDelegate*)[[UIApplication sharedApplication] delegate] viewController] dismissViewControllerAnimated:YES completion:^(void){}];
}

- (void)dealloc {

}
- (void)viewDidUnload {
    [self setSignatureView:nil];
    [super viewDidUnload];
}
@end
