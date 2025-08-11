<?php
// PHP webhook proxy for HubSpot (fallback for non-Netlify hosting)
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);
    exit;
}

try {
    // Get form data
    $full_name = $_POST['full_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';
    $notes = $_POST['notes'] ?? '';
    
    // Split name
    $name_parts = explode(' ', $full_name, 2);
    $firstname = $name_parts[0] ?? '';
    $lastname = $name_parts[1] ?? '';
    
    // HubSpot configuration (replace with actual values)
    $portalId = getenv('HUBSPOT_PORTAL_ID') ?: 'YOUR_HUBSPOT_PORTAL_ID';
    $formId = getenv('HUBSPOT_FORM_ID') ?: 'YOUR_HUBSPOT_FORM_ID';
    
    // Prepare HubSpot data
    $hubspotData = [
        'fields' => [
            ['name' => 'firstname', 'value' => $firstname],
            ['name' => 'lastname', 'value' => $lastname],
            ['name' => 'email', 'value' => $email],
            ['name' => 'phone', 'value' => $phone],
            ['name' => 'message', 'value' => $notes]
        ],
        'context' => [
            'pageUri' => $_SERVER['HTTP_REFERER'] ?? 'https://cityplacebnb.com',
            'pageName' => 'CityPlace BnB Lead Form'
        ]
    ];
    
    // Submit to HubSpot
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, "https://api.hsforms.com/submissions/v3/integration/submit/{$portalId}/{$formId}");
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($hubspotData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 200) {
        echo json_encode(['success' => true, 'message' => 'Form submitted successfully']);
    } else {
        throw new Exception('HubSpot submission failed');
    }
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Form submission failed', 'details' => $e->getMessage()]);
}
?>