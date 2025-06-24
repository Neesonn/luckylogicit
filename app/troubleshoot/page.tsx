'use client';
import React, { useState } from 'react';
import {
  Box,
  Heading,
  Container,
  Input,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  VStack,
  useColorModeValue,
  Tag,
  HStack,
  Icon,
  Button,
  Wrap,
  WrapItem,
  useBreakpointValue,
  VisuallyHidden,
  Link
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { FiSearch, FiMonitor, FiAlertTriangle, FiWifi, FiServer, FiPower, FiHelpCircle, FiShare2, FiCommand, FiGlobe, FiCheckCircle, FiCpu } from 'react-icons/fi';
import NextLink from 'next/link';
import GlassCard from '../../components/GlassCard';
import Head from 'next/head';
import { Tooltip, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';

type TroubleshootStep = string;

type SubIssue = {
  key: string;
  label: string;
  steps: TroubleshootStep[];
  showContactButtonAfterStep?: number;
};

type Issue = {
  key: string;
  label: string;
  steps?: TroubleshootStep[];
  subIssues?: SubIssue[];
};

type Category = {
  key: string;
  icon: any;
  label: string;
  issues: Issue[];
};

const categories: Category[] = [
  {
    key: 'windows',
    icon: FiCpu,
    label: 'Windows PC Issues',
    issues: [
      {
        key: 'performance',
        label: '🧊 Performance & Speed',
        subIssues: [
          {
            key: 'slow',
            label: '🐢 Computer Running Slow',
            steps: [
              'Step 1: Restart Your PC\nA simple restart can clear memory and resolve temporary glitches.',
              'Step 2: Check for Background Programs\nPress Ctrl + Shift + Esc to open Task Manager\nGo to the Processes tab\nSort by CPU or Memory to find resource-heavy apps\nRight-click any unnecessary apps and select End Task',
              'Step 3: Clear Temporary Files\nPress Windows + R, type temp and press Enter\nDelete all files in the folder\nRepeat with %temp% and prefetch folders',
              'Step 4: Disable Visual Effects\nOpen Start Menu, search for Performance Options\nClick Adjust the appearance and performance of Windows\nChoose Adjust for best performance, then click Apply',
              'Step 5: Free Up Disk Space\nOpen Settings → System → Storage\nUse Storage Sense to clean up unused files\nClick Temporary files to remove unnecessary data',
            ],
          },
          {
            key: 'cpu-memory',
            label: '🔥 High CPU or Memory Usage',
            steps: [
              'Step 1: Open Task Manager\nPress Ctrl + Shift + Esc\nLook at the CPU and Memory columns\nIdentify which processes are using the most resources',
              'Step 2: End Unnecessary Tasks\nRight-click the high-usage process\nClick End Task\n(Do not end system-critical processes)',
              'Step 3: Scan for Malware\nOpen Windows Security\nGo to Virus & Threat Protection\nClick Quick Scan or Full Scan',
              'Step 4: Update Drivers\nRight-click Start → Device Manager\nExpand Processors, Display adapters, etc.\nRight-click each and choose Update driver',
              'Step 5: Adjust Virtual Memory\nSearch Advanced System Settings\nUnder Performance, click Settings → Advanced → Virtual memory\nSet a custom size: Initial size = RAM size (MB), Max size = 1.5x RAM',
            ],
          },
          {
            key: 'freezing',
            label: '❄️ Programs Not Responding / Freezing',
            steps: [
              'Step 1: Wait a Few Seconds\nSometimes apps resume if you give them a moment',
              'Step 2: Force Close the App\nPress Ctrl + Shift + Esc\nRight-click the frozen app in Task Manager\nSelect End Task',
              'Step 3: Run in Compatibility Mode\nRight-click the app shortcut\nGo to Properties → Compatibility tab\nCheck Run this program in compatibility mode for:\nChoose a previous Windows version',
              'Step 4: Check for App Updates\nOpen the app and check for an update option\nOr reinstall the app from a trusted source',
              'Step 5: Scan System Files\nOpen Command Prompt as Administrator\nType: sfc /scannow\nPress Enter and wait for scan to finish',
            ],
          },
          {
            key: 'startup-apps',
            label: '🚀 Too Many Startup Apps Slowing Boot Time',
            steps: [
              'Step 1: Open Task Manager\nPress Ctrl + Shift + Esc\n\nClick on the Startup tab',
              'Step 2: Disable Unnecessary Startup Apps\nRight-click any app that says Enabled under the Status column\n\nSelect Disable\n(Leave antivirus and system apps enabled)',
              'Step 3: Review with Windows Settings\nOpen Settings → Apps → Startup\n\nToggle off apps you don\'t need to start with Windows',
              'Step 4: Use a Clean Boot\nPress Windows + R, type msconfig, and hit Enter\n\nGo to Services, check Hide all Microsoft services\n\nClick Disable all, then Apply and OK\n\nRestart your PC to test performance',
              'Step 5: Check for BIOS Fast Boot Options (Advanced)\nIf you are comfortable with BIOS settings, some PCs support a Fast Boot option in BIOS to speed up startup.',
            ],
          },
        ],
      },
      {
        key: 'system-errors',
        label: '💥 System Errors & Crashes',
        subIssues: [
          {
            key: 'bsod',
            label: '💻 Blue Screen of Death (BSOD)',
            steps: [
              'Step 1: Note the Error Code\nWrite down the error name or code shown on the BSOD (e.g. CRITICAL_PROCESS_DIED or 0x000000EF)',
              'Step 2: Remove External Devices\nUnplug USB drives, printers, and external hard drives\nRestart your PC to see if the issue repeats',
              'Step 3: Boot Into Safe Mode\nHold Shift while clicking Restart from the login screen\nNavigate to Troubleshoot → Advanced Options → Startup Settings → Restart\nPress 4 to enter Safe Mode',
              'Step 4: Check for Windows and Driver Updates\nGo to Settings → Windows Update\nClick Check for updates\nAlso open Device Manager, right-click critical drivers (graphics, chipset), and select Update driver',
              'Step 5: Scan for Malware\nOpen Windows Security → Virus & threat protection\nRun a full scan',
              'Step 6: Use System File Checker\nOpen Command Prompt as Administrator\nType: sfc /scannow\nPress Enter and wait for the scan to complete',
            ],
          },
          {
            key: 'crashing',
            label: '❄️ Frequent Freezing or Crashing',
            steps: [
              'Step 1: Check for Overheating\nDownload tools like HWMonitor to check CPU/GPU temperatures\nEnsure fans and vents are not blocked',
              'Step 2: Update Graphics and Chipset Drivers\nOpen Device Manager\nExpand Display adapters and System devices\nRight-click and update key drivers',
              'Step 3: Run Memory Diagnostics\nPress Windows + R, type mdsched.exe\nSelect Restart now and check for problems',
              'Step 4: Scan System Files\nOpen Command Prompt as Administrator, then type:\nsfc /scannow\nDISM /Online /Cleanup-Image /RestoreHealth',
              'Step 5: Uninstall Recently Installed Apps\nIf crashes began after installing something new, uninstall it from Settings → Apps',
            ],
          },
          {
            key: 'not-booting',
            label: '🧯 Windows Not Booting Properly',
            steps: [
              'Step 1: Use Startup Repair\nTurn off your PC, then turn it back on and hold the power button as soon as Windows starts loading\nRepeat this 3 times to force Windows into Recovery Mode\nClick Advanced options → Startup Repair',
              'Step 2: Boot Into Safe Mode\nFrom Recovery Mode:\nTroubleshoot → Advanced Options → Startup Settings → Restart\nPress 4 or 5 to boot into Safe Mode',
              'Step 3: Perform System Restore\nFrom Recovery Mode:\nTroubleshoot → Advanced Options → System Restore\nChoose a restore point before the issue started',
              'Step 4: Rebuild the Boot Configuration\nIn Recovery Command Prompt, type:\nbootrec /fixmbr\nbootrec /fixboot\nbootrec /scanos\nbootrec /rebuildbcd',
              'Step 5: Reset Windows (last resort)\nTroubleshoot → Reset this PC\nYou can keep your files or remove everything',
            ],
          },
          {
            key: 'black-screen',
            label: '🕳️ Black Screen After Login',
            steps: [
              'Step 1: Try Task Manager\nPress Ctrl + Shift + Esc\nIf it opens, click File → Run new task\nType explorer.exe and hit Enter',
              'Step 2: Boot Into Safe Mode\nFollow the steps above to reach Safe Mode',
              'Step 3: Disable Fast Startup\nBoot into Safe Mode\nGo to Control Panel → Power Options → Choose what the power buttons do\nClick Change settings that are currently unavailable\nUncheck Turn on fast startup',
              'Step 4: Update Graphics Driver\nFrom Safe Mode:\nOpen Device Manager → Display adapters\nRight-click and Uninstall your GPU driver\nRestart to allow Windows to reinstall a basic version',
              'Step 5: Perform System Restore\nUse System Restore from Safe Mode or Recovery Mode to roll back to a stable point',
            ],
          },
        ],
      },
      {
        key: 'display',
        label: '🖥 Display & Visuals',
        subIssues: [
          {
            key: 'screen-flicker',
            label: '⚡ Screen Flickering',
            steps: [
              'Step 1: Identify the Cause\nCheck if the flickering happens in Safe Mode\nIf not, it is likely a driver or software conflict',
              'Step 2: Update Display Driver\nRight-click Start → Device Manager\nExpand Display adapters\nRight-click your display device → Select Update driver\nChoose Search automatically for drivers',
              'Step 3: Uninstall Problematic Software\nKnown culprits include Norton, iCloud, IDT Audio\nOpen Settings → Apps, and uninstall suspicious programs\nRestart your computer',
              'Step 4: Reinstall Graphics Driver\nIn Device Manager, right-click your display adapter\nSelect Uninstall device\nRestart your PC to allow automatic reinstallation',
            ],
          },
          {
            key: 'resolution',
            label: '🖼️ Display Resolution Issues',
            steps: [
              'Step 1: Open Display Settings\nRight-click your desktop → Click Display settings\nScroll down to Display resolution',
              'Step 2: Set Recommended Resolution\nChoose the one marked as (Recommended)\nMost modern displays use 1920x1080 or higher',
              'Step 3: Update Graphics Driver\nUse Device Manager to check for updated drivers (same steps as above)',
              'Step 4: Check Monitor Cable\nEnsure the monitor cable (HDMI, DisplayPort, VGA) is plugged in securely\nTry a different port or cable if available',
            ],
          },
          {
            key: 'multi-monitor',
            label: '🖥️ Multiple Monitor Problems',
            steps: [
              'Step 1: Detect All Displays\nGo to Settings → System → Display\nClick Detect to find missing monitors\nScroll to Multiple displays, choose Extend, Duplicate, or Second screen only',
              'Step 2: Match Resolutions and Scaling\nMake sure both monitors use supported resolutions and scaling values\nMismatched settings can cause black screens or flickering',
              'Step 3: Update or Reconnect Hardware\nUse DisplayPort or HDMI, not VGA if possible\nReconnect cables and power cycle your monitors\nUpdate display drivers in Device Manager',
              'Step 4: Use Display Configuration Shortcuts\nPress Windows + P to toggle between projection modes:\nPC screen only\nDuplicate\nExtend\nSecond screen only',
            ],
          },
          {
            key: 'scaling',
            label: '🔎 Scaling or Font Blurry on High-DPI Screens',
            steps: [
              'Step 1: Use Recommended Scaling\nOpen Settings → System → Display\nUnder Scale and layout, set to 100% or the recommended value',
              'Step 2: Turn Off Display Scaling for Specific Apps\nRight-click the app shortcut → Properties\nGo to Compatibility → Change high DPI settings\nTick Override high DPI scaling\nSelect Application from the dropdown',
              'Step 3: Adjust ClearType Settings\nSearch Adjust ClearType text in the Start Menu\nFollow the on-screen wizard to fine-tune font clarity',
              'Step 4: Check for Windows Updates\nMicrosoft often pushes display fixes in updates\nGo to Settings → Windows Update → Check for updates',
            ],
          },
        ],
      },
      {
        key: 'audio',
        label: '🔊 Sound & Audio',
        subIssues: [
          {
            key: 'no-sound',
            label: '🔇 No Sound from Speakers or Headphones',
            steps: [
              'Check volume slider and mute icon in the taskbar',
              'Try a different audio device from the sound output list',
              'Run Audio Troubleshooter from Settings → System → Sound → Troubleshoot',
              'Reinstall or update audio drivers in Device Manager → Sound, video and game controllers',
              'Test with a different speaker or headphone',
            ],
          },
          {
            key: 'mic',
            label: '🎤 Microphone Not Working',
            steps: [
              'Check physical mute switch or function key shortcut (e.g. Fn + F4)',
              'Go to Settings → Privacy & Security → Microphone and make sure microphone access is on',
              'Set the correct input device under System → Sound → Input',
              'Update or reinstall microphone drivers',
            ],
          },
          {
            key: 'crackling',
            label: '📢 Audio Crackling or Distorted',
            steps: [
              'Switch to a different audio port or use USB audio',
              'Update sound drivers',
              'Change audio format: Sound settings → Device properties → Advanced tab',
              'Disable audio enhancements under Sound settings → Enhancements',
            ],
          },
          {
            key: 'wrong-output',
            label: '🔀 Apps Playing Sound in Wrong Output',
            steps: [
              'Open Settings → Sound → Advanced → App volume and device preferences',
              'Assign specific output devices for each app',
              'Restart affected app after changing output',
            ],
          },
        ],
      },
      {
        key: 'login',
        label: '🔐 Login & Security',
        subIssues: [
          {
            key: 'cant-login',
            label: '🔑 Can\'t Log In (Forgot Password / PIN)',
            steps: [
              'Click I forgot my password/PIN on the login screen',
              'Follow on-screen instructions to reset via email or phone',
              'For local accounts, reset password via Recovery Options if enabled',
            ],
          },
          {
            key: 'profile-corrupt',
            label: '👤 User Profile Corrupted',
            steps: [
              'Boot into Safe Mode',
              'Open Registry Editor and rename .bak profile if available',
              'Create a new user and transfer files manually',
              'Or use System Restore to revert to a stable state',
            ],
          },
          {
            key: 'hello',
            label: '👁️ Windows Hello Not Working',
            steps: [
              'Remove and re-set up facial recognition or fingerprint\nSettings → Accounts → Sign-in options',
              'Update biometric drivers in Device Manager',
              'Check camera or fingerprint sensor is not obstructed',
            ],
          },
          {
            key: 'locked-out',
            label: '🔒 Locked Out of PC',
            steps: [
              'Use a recovery USB or installation media to boot into recovery',
              'Use System Restore or reset the PC while keeping files',
              'Contact Microsoft Support if unable to access admin account',
            ],
          },
        ],
      },
      {
        key: 'updates',
        label: '🧱 Updates & Software',
        subIssues: [
          {
            key: 'update-stuck',
            label: '⏳ Windows Update Stuck or Failing',
            steps: [
              'Run Windows Update Troubleshooter',
              'Clear update cache: stop Windows Update service, delete C:\\Windows\\SoftwareDistribution, then restart the service',
              'Restart and retry updates manually',
            ],
          },
          {
            key: 'driver-issues',
            label: '🧩 Driver Issues After Update',
            steps: [
              'Roll back driver in Device Manager → Driver → Roll Back',
              'Use System Restore to undo recent changes',
              'Reinstall official drivers from manufacturer\'s website',
            ],
          },
          {
            key: 'cant-install',
            label: '🗑️ Can\'t Install or Uninstall Programs',
            steps: [
              'Use Settings → Apps → Installed Apps or Control Panel',
              'Run the Program Install and Uninstall troubleshooter from Microsoft',
              'Delete leftovers from C:\\Program Files and registry manually if needed',
            ],
          },
          {
            key: 'apps-wont-open',
            label: '🚫 Apps Won\'t Open',
            steps: [
              'Reboot your PC',
              'Reinstall or update the app',
              'Run as Administrator',
              'Check for missing dependencies (like .NET Framework)',
            ],
          },
        ],
      },
      {
        key: 'storage',
        label: '🧹 Storage & Disk',
        subIssues: [
          {
            key: 'disk-space',
            label: '💾 Running Out of Disk Space',
            steps: [
              'Use Storage Sense: Settings → System → Storage',
              'Empty Recycle Bin and clear Downloads',
              'Move files to external drive or cloud storage',
              'Uninstall unused programs',
            ],
          },
          {
            key: 'explorer-freeze',
            label: '🗂️ File Explorer Freezing',
            steps: [
              'Clear Quick Access history from Folder Options',
              'Disable preview pane',
              'Run sfc /scannow and DISM /Online /Cleanup-Image /RestoreHealth',
            ],
          },
          {
            key: 'external-drive',
            label: '🔌 External Drive Not Detected',
            steps: [
              'Try a different port or cable',
              'Check Disk Management to see if drive is listed',
              'Assign a drive letter if it has none',
              'Update USB and chipset drivers',
            ],
          },
          {
            key: 'disk-100',
            label: '📊 Disk Usage 100% in Task Manager',
            steps: [
              'Disable Windows Search and Superfetch services',
              'Update storage controller drivers',
              'Check for malware',
              'Replace failing hard drive (common on HDDs)',
            ],
          },
        ],
      },
      {
        key: 'other',
        label: '💡 Other Everyday Issues',
        subIssues: [
          {
            key: 'printer',
            label: '🖨️ Printer Not Working',
            steps: [
              'Reconnect cable or re-add wireless printer',
              'Run Printer Troubleshooter',
              'Set correct printer as default',
              'Clear print queue in Settings → Printers & scanners',
            ],
          },
          {
            key: 'mouse-keyboard',
            label: '🖱️ Mouse/Keyboard Not Detected',
            steps: [
              'Try a different USB port',
              'Replace batteries if wireless',
              'Check if working in BIOS or another PC',
              'Reinstall input drivers in Device Manager',
            ],
          },
          {
            key: 'battery',
            label: '🔋 Battery Draining Fast (on laptops)',
            steps: [
              'Lower screen brightness',
              'Disable background apps in Settings → Battery',
              'Run Power Troubleshooter',
              'Use Battery Saver mode',
            ],
          },
          {
            key: 'time-date',
            label: '⏰ Time and Date Wrong',
            steps: [
              'Sync time with internet server: Settings → Time & Language → Date & Time → Sync now',
              'Replace CMOS battery if clock resets on reboot (advanced)',
              'Set correct time zone manually',
            ],
            showContactButtonAfterStep: 1,
          },
        ],
      },
    ],
  },
];

const MotionBox = motion(Box);

// Add a normalization function for search
function normalize(str: string) {
  return str
    .toLowerCase()
    .replace(/[-–—\s]+/g, '') // remove dashes and spaces
    .replace(/wi[-]?fi/g, 'wifi') // treat 'wi-fi' and 'wifi' as the same
    .normalize('NFD').replace(/[ -]/g, ''); // remove accents
}

export default function TroubleshootPage() {
  const [search, setSearch] = useState('');
  const bg = useColorModeValue('white', 'gray.800');
  const border = useColorModeValue('gray.200', 'gray.700');
  const completedTextColor = useColorModeValue('green.700', 'gray.200');
  const defaultTextColor = useColorModeValue('gray.700', 'gray.200');
  const completedStepBg = useColorModeValue('green.50', 'gray.900');
  const defaultStepBg = useColorModeValue('white', 'gray.800');
  const hoverStepBg = useColorModeValue('green.100', 'gray.700');
  // Track completed steps for each issue by unique key
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean[]>>({});

  // Mobile-first: pill selection for categories
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter categories/issues by search
  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      issues: cat.issues.filter(
        (issue) => {
          // Check main issue label and steps
          if (
            normalize(issue.label).includes(normalize(search)) ||
            issue.steps?.some((s) => normalize(s).includes(normalize(search)))
          ) {
            return true;
          }
          // Check sub-issues
          if (issue.subIssues) {
            return issue.subIssues.some((sub) =>
              normalize(sub.label).includes(normalize(search)) ||
              sub.steps?.some((s) => normalize(s).includes(normalize(search)))
            );
          }
          return false;
        }
      ),
    }))
    .filter((cat) => cat.issues.length > 0);

  // For mobile: only show selected category
  const categoriesToShow = isMobile && selectedCategory
    ? filteredCategories.filter((cat) => cat.key === selectedCategory)
    : filteredCategories;

  return (
    <Container maxW="3xl" py={{ base: 8, md: 16 }} style={{ userSelect: 'none', WebkitUserSelect: 'none', MozUserSelect: 'none', msUserSelect: 'none' }}>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": categories.flatMap(cat =>
              cat.issues.map(issue => ({
                "@type": "Question",
                "name": issue.label,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": (issue.steps || []).join('<br/>')
                }
              }))
            )
          }) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.luckylogic.com.au/" },
              { "@type": "ListItem", "position": 2, "name": "Troubleshooting Guide", "item": "https://www.luckylogic.com.au/troubleshoot" }
            ]
          }) }}
        />
      </Head>
      <Heading as="h1" size="2xl" mb={6} color="brand.green" textAlign="center" fontWeight="extrabold" textTransform="capitalize">
        Troubleshooting Guide
      </Heading>
      <Text fontSize="lg" color="gray.600" textAlign="center" mb={8}>
        Find solutions to common tech issues. Select a category and issue for step-by-step help.<br />
        <Text as="span" display="block" mt={2}>
          Still struggling? <NextLink href="/contact-us" passHref legacyBehavior>
            <Link color="brand.green" fontWeight="bold" textDecoration="underline" _hover={{ color: 'green.600' }} aria-label="Contact us for further help">
              Send us a message
            </Link>
          </NextLink> and our team will be happy to assist you.
        </Text>
      </Text>
      {/* Pills for mobile category selection */}
      {isMobile && (
        <Wrap spacing={3} mb={6} justify="center">
          {filteredCategories.map((cat) => (
            <WrapItem key={cat.key}>
              <Button
                variant={selectedCategory === cat.key ? 'solid' : 'outline'}
                colorScheme="green"
                leftIcon={<Icon as={cat.icon} />}
                borderRadius="full"
                px={5}
                py={2}
                fontWeight="bold"
                fontSize="md"
                onClick={() => setSelectedCategory(cat.key)}
                _active={{ transform: 'scale(0.97)' }}
                _focus={{ boxShadow: 'outline' }}
              >
                {cat.label}
              </Button>
            </WrapItem>
          ))}
          {selectedCategory && (
            <WrapItem>
              <Button
                variant="ghost"
                colorScheme="gray"
                borderRadius="full"
                px={4}
                py={2}
                fontWeight="bold"
                fontSize="md"
                onClick={() => setSelectedCategory(null)}
              >
                Show All
              </Button>
            </WrapItem>
          )}
        </Wrap>
      )}
      <Box
        borderRadius="2xl"
        px={{ base: 4, md: 8 }}
        py={{ base: 6, md: 10 }}
        bgGradient="linear(to-br, brand.lightGreen, white)"
        boxShadow="0 8px 32px 0 rgba(31, 38, 135, 0.10)"
        mb={8}
      >
        <Accordion allowMultiple defaultIndex={[0]}>
          {categoriesToShow.length === 0 && (
            <Text color="red.400" textAlign="center" py={10}>
              <Icon as={FiAlertTriangle} mr={2} /> No issues found. Try a different search.
            </Text>
          )}
          {categoriesToShow.map((cat) => (
            <GlassCard key={cat.key} mb={10}>
              <AccordionItem borderColor={border}>
                <h2>
                  <AccordionButton _expanded={{ bg: 'brand.green', color: 'white' }} aria-label={`Expand/collapse issue: ${cat.label}`}>
                    <HStack spacing={5}>
                      <Icon as={cat.icon} />
                      <Box flex="1" textAlign="left" fontWeight="extrabold" fontSize="2xl" textTransform="capitalize" letterSpacing="wide">
                        {cat.label}
                      </Box>
                    </HStack>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Accordion allowMultiple>
                    {cat.issues.map((issue) => (
                      <AccordionItem key={issue.key} borderColor={border}>
                        <h3>
                          <AccordionButton _expanded={{ bg: 'gray.100', color: 'brand.green' }} aria-label={`Expand/collapse issue: ${issue.label}`}>
                            <HStack spacing={4} w="100%">
                              <Box flex="1" textAlign="left" fontWeight="bold" fontSize="xl" textTransform="capitalize" letterSpacing="wide">
                                {issue.label}
                              </Box>
                            </HStack>
                            <AccordionIcon />
                          </AccordionButton>
                        </h3>
                        <AccordionPanel pb={2}>
                          {/* If issue has subIssues, render a nested Accordion */}
                          {Array.isArray(issue.subIssues) && issue.subIssues.length > 0 && (
                            <Accordion allowMultiple>
                              {issue.subIssues?.map((sub) => {
                                // Interactive step completion state for each sub-issue
                                const subCompleted: boolean[] = Array.isArray(completedSteps[sub.key]) ? completedSteps[sub.key] : Array(sub.steps?.length || 0).fill(false);
                                const handleSubStepClick = (idx: number) => {
                                  setCompletedSteps((prev) => {
                                    const arr = prev[sub.key] ? [...prev[sub.key]] : Array(sub.steps?.length || 0).fill(false);
                                    arr[idx] = !arr[idx];
                                    return { ...prev, [sub.key]: arr };
                                  });
                                };
                                return (
                                  <AccordionItem key={sub.key} borderColor={border}>
                                    <h4>
                                      <AccordionButton _expanded={{ bg: 'gray.50', color: 'brand.green' }} aria-label={`Expand/collapse issue: ${sub.label}`}>
                                        <Box flex="1" textAlign="left">
                                          <Text fontWeight="semibold" mr={2}>
                                            {sub.label}
                                          </Text>
                                        </Box>
                                        <AccordionIcon />
                                      </AccordionButton>
                                    </h4>
                                    <AccordionPanel pb={2}>
                                      {sub.steps?.length > 0 && (
                                        <MotionBox
                                          initial={{ opacity: 0, y: 10 }}
                                          animate={{ opacity: 1, y: 0 }}
                                          transition={{ duration: 0.3 }}
                                          p={4}
                                          bg={bg}
                                          borderRadius="lg"
                                          borderWidth={1}
                                          borderColor={border}
                                          boxShadow="md"
                                        >
                                          <VStack align="start" spacing={6} w="100%">
                                            <Text fontWeight="bold" color="brand.green" fontSize="xl" mb={2}>
                                              {sub.label} Troubleshooting Steps
                                            </Text>
                                            {sub.steps?.map((step, idx) => {
                                              const [title, ...detailsArr] = step.split('\n');
                                              const details = detailsArr.join('\n');
                                              const showContactButton = typeof sub.showContactButtonAfterStep === 'number' && idx === sub.showContactButtonAfterStep;
                                              // Get completed state for this issue/step
                                              const completedArr: boolean[] = Array.isArray(completedSteps[issue.key]) ? completedSteps[issue.key] : Array(issue.steps?.length || 0).fill(false);
                                              const completed = completedArr[idx];
                                              const handleStepClick = () => {
                                                setCompletedSteps((prev) => {
                                                  const arr = prev[issue.key] ? [...prev[issue.key]] : Array(issue.steps?.length || 0).fill(false);
                                                  arr[idx] = !arr[idx];
                                                  return { ...prev, [issue.key]: arr };
                                                });
                                              };
                                              return (
                                                <Box
                                                  key={idx}
                                                  w="100%"
                                                  bg={subCompleted[idx] ? completedStepBg : defaultStepBg}
                                                  borderRadius="lg"
                                                  boxShadow="sm"
                                                  p={4}
                                                  borderLeftWidth={4}
                                                  borderLeftColor={subCompleted[idx] ? 'green.400' : 'brand.green'}
                                                  mb={2}
                                                  cursor="pointer"
                                                  transition="background 0.2s, border-color 0.2s"
                                                  onClick={() => handleSubStepClick(idx)}
                                                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleSubStepClick(idx); }}
                                                  role="button"
                                                  aria-pressed={subCompleted[idx]}
                                                  aria-label={`Mark step ${idx + 1} as ${subCompleted[idx] ? 'incomplete' : 'complete'}: ${title}`}
                                                  aria-describedby={`step-desc-${sub.key}-${idx}`}
                                                  tabIndex={0}
                                                  _hover={{ bg: hoverStepBg }}
                                                >
                                                  <VisuallyHidden id={`step-desc-${sub.key}-${idx}`}>
                                                    {subCompleted[idx] ? 'Step completed' : 'Step not completed'}
                                                  </VisuallyHidden>
                                                  <HStack align="center" spacing={2} mb={1}>
                                                    <Text
                                                      fontWeight="semibold"
                                                      color={subCompleted[idx] ? 'green.600' : 'brand.green'}
                                                      fontSize="md"
                                                      textDecoration={subCompleted[idx] ? 'line-through' : 'none'}
                                                    >
                                                      {title}
                                                    </Text>
                                                    {subCompleted[idx] && <Icon as={FiCheckCircle} color="green.400" boxSize={5} ml={2} />}
                                                  </HStack>
                                                  <Text
                                                    color={subCompleted[idx] ? completedTextColor : defaultTextColor}
                                                    fontSize="md"
                                                    whiteSpace="pre-line"
                                                    textDecoration={subCompleted[idx] ? 'line-through' : 'none'}
                                                    opacity={subCompleted[idx] ? 0.7 : 1}
                                                    mb={showContactButton ? 4 : 0}
                                                  >
                                                    {details}
                                                  </Text>
                                                  {showContactButton && (
                                                    <Button
                                                      as={NextLink}
                                                      href="/contact-us"
                                                      prefetch
                                                      bg="#003f2d"
                                                      color="white"
                                                      size="lg"
                                                      fontWeight="bold"
                                                      borderRadius="xl"
                                                      px={8}
                                                      py={6}
                                                      boxShadow="md"
                                                      _hover={{ bg: '#00291d', color: 'white' }}
                                                      _focus={{ boxShadow: 'outline', bg: '#003f2d' }}
                                                    >
                                                      Contact us
                                                    </Button>
                                                  )}
                                                </Box>
                                              );
                                            })}
                                          </VStack>
                                        </MotionBox>
                                      )}
                                    </AccordionPanel>
                                  </AccordionItem>
                                );
                              })}
                            </Accordion>
                          )}
                          {/* If issue has steps and no subIssues, render steps here */}
                          {issue.steps && !issue.subIssues && issue.steps?.length > 0 && (
                            <MotionBox
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              p={{ base: 2, md: 6 }}
                              bg={useColorModeValue('gray.50', 'gray.700')}
                              borderRadius="xl"
                              borderWidth={1}
                              borderColor={border}
                              boxShadow="lg"
                            >
                              <VStack align="start" spacing={6} w="100%">
                                <Text fontWeight="bold" color="brand.green" fontSize="xl" mb={2}>
                                  {issue.label} Troubleshooting Steps
                                </Text>
                                {issue.steps?.map((step: string, idx: number) => {
                                  const [title, ...detailsArr] = step.split('\n');
                                  let details = detailsArr.join('\n');
                                  let showContactButton = false;
                                  if (idx === 7) {
                                    const contactText = 'Contact your Internet Service Provider.';
                                    if (details.includes(contactText)) {
                                      details = details.replace(contactText, '');
                                      showContactButton = true;
                                    }
                                  }
                                  let StepIcon = null;
                                  if (idx === 0) StepIcon = FiWifi;
                                  if (idx === 1) StepIcon = FiServer;
                                  if (idx === 2) StepIcon = FiPower;
                                  if (idx === 3) StepIcon = FiHelpCircle;
                                  if (idx === 4) StepIcon = FiShare2;
                                  if (idx === 5) StepIcon = FiCommand;
                                  if (idx === 6) StepIcon = FiGlobe;
                                  if (idx === 7) StepIcon = FiHelpCircle;
                                  // Get completed state for this issue/step
                                  const completedArr: boolean[] = Array.isArray(completedSteps[issue.key]) ? completedSteps[issue.key] : Array(issue.steps?.length || 0).fill(false);
                                  const completed = completedArr[idx];
                                  const handleStepClick = () => {
                                    setCompletedSteps((prev) => {
                                      const arr = prev[issue.key] ? [...prev[issue.key]] : Array(issue.steps?.length || 0).fill(false);
                                      arr[idx] = !arr[idx];
                                      return { ...prev, [issue.key]: arr };
                                    });
                                  };
                                  return (
                                    <Box
                                      key={idx}
                                      w="100%"
                                      bg={completed ? completedStepBg : defaultStepBg}
                                      borderRadius="lg"
                                      boxShadow="sm"
                                      p={4}
                                      borderLeftWidth={4}
                                      borderLeftColor={completed ? 'green.400' : 'brand.green'}
                                      mb={2}
                                      cursor="pointer"
                                      transition="background 0.2s, border-color 0.2s"
                                      onClick={handleStepClick}
                                      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') handleStepClick(); }}
                                      role="button"
                                      aria-pressed={completed}
                                      aria-label={`Mark step ${idx + 1} as ${completed ? 'incomplete' : 'complete'}: ${title}`}
                                      aria-describedby={`step-desc-${issue.key}-${idx}`}
                                      tabIndex={0}
                                      _hover={{ bg: hoverStepBg }}
                                    >
                                      <VisuallyHidden id={`step-desc-${issue.key}-${idx}`}>
                                        {completed ? 'Step completed' : 'Step not completed'}
                                      </VisuallyHidden>
                                      <HStack align="center" spacing={2} mb={1}>
                                        {StepIcon && <Icon as={StepIcon} color={completed ? 'green.400' : 'brand.green'} boxSize={5} />}
                                        <Text
                                          fontWeight="semibold"
                                          color={completed ? 'green.600' : 'brand.green'}
                                          fontSize="md"
                                          textDecoration={completed ? 'line-through' : 'none'}
                                        >
                                          {title}
                                        </Text>
                                        {completed && <Icon as={FiCheckCircle} color="green.400" boxSize={5} ml={2} />}
                                      </HStack>
                                      <Text
                                        color={completed ? completedTextColor : defaultTextColor}
                                        fontSize="md"
                                        whiteSpace="pre-line"
                                        textDecoration={completed ? 'line-through' : 'none'}
                                        opacity={completed ? 0.7 : 1}
                                        mb={showContactButton ? 4 : 0}
                                      >
                                        {details}
                                      </Text>
                                      {showContactButton && (
                                        <Button
                                          as={NextLink}
                                          href="/contact-us"
                                          prefetch
                                          bg="#003f2d"
                                          color="white"
                                          size="lg"
                                          fontWeight="bold"
                                          borderRadius="xl"
                                          px={8}
                                          py={6}
                                          boxShadow="md"
                                          _hover={{ bg: '#00291d', color: 'white' }}
                                          _focus={{ boxShadow: 'outline', bg: '#003f2d' }}
                                        >
                                          Contact us
                                        </Button>
                                      )}
                                    </Box>
                                  );
                                })}
                              </VStack>
                            </MotionBox>
                          )}
                        </AccordionPanel>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            </GlassCard>
          ))}
        </Accordion>
      </Box>
    </Container>
  );
} 