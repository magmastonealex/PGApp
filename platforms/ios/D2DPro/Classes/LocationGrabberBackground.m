//
//  LocationGrabberBackground.m
//  D2DPro
//
//  Created by Anne Roth on 13-08-09.
//
//

#import "LocationGrabberBackground.h"

@implementation LocationGrabberBackground
@synthesize locationManager;
@synthesize devid;
@synthesize userID;
int freqMinutes;
long triggerTime;
-(id)init{
    self = [super init];
    if(self){
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        self.locationManager.delegate = self;
        devid = @"none";
        userID = @"none";
    }
    NSLog(@"Ready to start updating location.");
    
    return self;
}

-(void)locationFrequency:(NSString*)freqMin{
    if([freqMin intValue] == 10000){
        [self.locationManager stopUpdatingLocation];
        NSLog(@"Stopped updating location.");
    }
    else{
    [self.locationManager startUpdatingLocation];
    freqMinutes=[freqMin intValue];
    }
}

-(void)insertHandler{
    triggerTime = CFAbsoluteTimeGetCurrent()+5;
    [self.locationManager startUpdatingLocation];
    NSLog(@"Began updating location. every %ld", triggerTime);
}


- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations{
    CLLocation *loc = [locations objectAtIndex:0];
    if(CFAbsoluteTimeGetCurrent() > triggerTime){
        triggerTime = CFAbsoluteTimeGetCurrent()+(freqMinutes);
        NSLog(@"Got a location update: %f, %f", loc.coordinate.latitude, loc.coordinate.longitude);
        NSURL *url = [NSURL URLWithString:@"http://app.d2dpro.com/submit_location.php"];
        if(![devid isEqualToString:@"none"]){
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLCacheStorageNotAllowed timeoutInterval:3.0];
            [request setValue:devid forHTTPHeaderField:@"deviceID"];
            [request setValue:userID forHTTPHeaderField:@"userID"];
            [request setValue:[NSString stringWithFormat:@"%d", freqMinutes] forHTTPHeaderField:@"interval"];
            [request setValue:[NSString stringWithFormat:@"%f", loc.coordinate.latitude] forHTTPHeaderField:@"latitude"];
            [request setValue:[NSString stringWithFormat:@"%f", loc.coordinate.longitude] forHTTPHeaderField:@"longitude"];
            NSLog(@"Will post request. %i,%@,%@", freqMinutes, devid, userID);
        NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
            [connection start];
            
        }
    }
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    NSLog(@"Finished Posting");
}


@end
