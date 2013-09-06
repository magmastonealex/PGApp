//
//  LocationGrabberBackground.m
//  D2DPro
//
//  Created by Anne Roth on 13-08-09.
//
//

#import "LocationGrabberBackground.h"
#import "TestFlight.h"
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

- (NSData*)encodeDictionary:(NSDictionary*)dictionary {
    NSMutableArray *parts = [[NSMutableArray alloc] init];
    for (NSString *key in dictionary) {
        NSString *encodedValue = [[dictionary objectForKey:key] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        NSString *encodedKey = [key stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
        NSString *part = [NSString stringWithFormat: @"%@=%@", encodedKey, encodedValue];
        [parts addObject:part];
    }
    NSString *encodedDictionary = [parts componentsJoinedByString:@"&"];
    return [encodedDictionary dataUsingEncoding:NSUTF8StringEncoding];
}


- (void)locationManager:(CLLocationManager *)manager didUpdateLocations:(NSArray *)locations{
    CLLocation *loc = [locations objectAtIndex:0];
    if(CFAbsoluteTimeGetCurrent() > triggerTime){
        triggerTime = CFAbsoluteTimeGetCurrent()+(freqMinutes);
        NSLog(@"Updating location : %f, %f", loc.coordinate.latitude, loc.coordinate.longitude);
        NSURL *url = [NSURL URLWithString:@"http://app.d2dpro.com/submit_location.php"];
        if(![devid isEqualToString:@"none"]){
        NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:url cachePolicy:NSURLCacheStorageNotAllowed timeoutInterval:3.0];
            
            
            
            NSMutableDictionary * mutPostDict = [[NSMutableDictionary alloc] initWithCapacity:7];
            [mutPostDict setValue:devid forKey:@"deviceID"];
            [mutPostDict setValue:userID forKey:@"userID"];
            [mutPostDict setValue:[NSString stringWithFormat:@"%d", freqMinutes] forKey:@"interval"];
            [mutPostDict setValue:[NSString stringWithFormat:@"%f", loc.coordinate.latitude] forKey:@"latitude"];
            [mutPostDict setValue:[NSString stringWithFormat:@"%f", loc.coordinate.longitude] forKey:@"longitude"];
            
            NSData * postData = [self encodeDictionary:mutPostDict];
            
            [request setHTTPMethod:@"POST"];
            [request setValue:[NSString stringWithFormat:@"%d", postData.length] forHTTPHeaderField:@"Content-Length"];
            [request setValue:@"application/x-www-form-urlencoded charset=utf-8" forHTTPHeaderField:@"Content-Type"];
            [request setHTTPBody:postData];
            
            NSLog(@"Will post request. %@", [request description]);
        NSURLConnection *connection = [[NSURLConnection alloc] initWithRequest:request delegate:self];
            [connection start];
            
        }
    }
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    TFLog(@"Finished Posting");
}


@end
