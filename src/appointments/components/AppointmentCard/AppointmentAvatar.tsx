const PLACEHOLDER = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png?20200919003010';

interface AppointmentAvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md';
}

export default function AppointmentAvatar({ src, alt, size = 'md' }: AppointmentAvatarProps) {
    const sizeClass = size === 'sm' ? 'w-9' : 'w-12';
    const imgSrc = src ?? PLACEHOLDER;

    return (
        <div
            role="img"
            aria-label={alt ?? 'Avatar'}
            className={`${sizeClass} aspect-square shrink-0 rounded-full bg-gray-200 bg-center bg-no-repeat bg-contain`}
            style={{ backgroundImage: `url(${imgSrc})` }}
        />
    );
}