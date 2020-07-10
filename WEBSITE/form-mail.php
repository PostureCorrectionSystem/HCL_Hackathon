<?php
if(!isset($_POST['submit']))
{
    echo "Error! You need to submit the form!";
}
$visitor_email = $_POST['email'];
$message = $_POST['Thank you for subscribing to our  newsletter! From this point onwards you will get exclusive discounts and regular updates about our products'];

// Validate first
if(empty($visitor_email))
{
    echo "E-mail ID is mandatory!!!!";
    exit;
}

$email_from = 'ananthakrishna2001@gmail.com'; //<-- our email
$email_subject = 'Subscription to our newsletter';
$email_body = "Dear Customer, \n $message";
$to = "$visitor_mail";
$headers =  "From: $email_from\r\n";

// Send mail

mail($to,$email_subject,$email_body,$headers);
