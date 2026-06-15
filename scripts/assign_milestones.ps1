Write-Host "Assignation massive des milestones via API GitHub..."

$m0 = @(118, 117, 116, 115, 114, 113, 112, 111, 110, 109, 108, 107, 106)
$m1 = @(124, 123, 122, 91, 94, 100, 87, 85, 84, 83, 82, 81, 80, 79)
$s2 = @(92, 93, 88)
$m2 = @(103, 102, 101, 96)
$s1 = @(90, 89)
$s3 = @(97, 95)
$s4 = @(99, 98)

function Assign-Milestone($issues, $milestoneNum) {
    foreach ($issue in $issues) {
        gh api "repos/digitaleflex/joinhashcode/issues/$issue" -X PATCH -f milestone=$milestoneNum > $null
        Write-Host "Issue #$issue -> Milestone $milestoneNum"
    }
}

Assign-Milestone $m0 14
Assign-Milestone $m1 15
Assign-Milestone $s2 10
Assign-Milestone $m2 13
Assign-Milestone $s1 9
Assign-Milestone $s3 11
Assign-Milestone $s4 12

Write-Host "Opération terminée avec succès !"
